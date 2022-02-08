import { queryInfo } from "./api/core";
import { RevoltConfiguration } from "./api/types/core";
import { EventClient, IncomingMessage } from "./websocket/client";
import { createStore, DeepReadonly } from "solid-js/store";
import { Id } from "./api/types/common";
import { RelationshipStatus, User } from "./api/types/users";
import { Member, Server } from "./api/types/servers";
import { Channel } from "./api/types/channels";
import { fetchUser, generateDefaultAvatarUrl } from "./api/users";
import { fetchMessages, sendMessage } from "./api/messages";
import {
  FetchOptions,
  Message,
  RetrievedMessages,
  SendMessage,
} from "./api/types/messages";
import { ServerMessages } from "./websocket/types";

import { createMemo } from "solid-js";
import { generateAttatchmentUrl } from "./api/autumn";
import { DEFAULT_PERMISSION_DM, U32_MAX } from "./api/permissions";
import * as ulid from "ulid";

// remove when `Array.prototype.groupBy` is better supported
function groupBy<T>(
  array: readonly T[],
  selector: (el: T) => string,
): Record<string, T> {
  const ret: Record<string, T> = {};

  for (const element of array) {
    const key = selector(element);
    ret[key] = element;
  }

  return ret;
}

interface IdItem {
  _id: Id;
}
const collect = <T extends IdItem>(list: T[]) => groupBy(list, (l) => l._id);

type State = {
  connected: boolean;
  ready: boolean;
  users: Record<Id, User>;
  /** user @ server */
  members: Record<`${Id}@${Id}`, Member>;
  servers: Record<Id, Server>;
  channels: Record<Id, Channel>;
  messages: Record<Id, Message>;
  messageThreads: Record<Id, Id[]>;
};

type ClientOptions = {
  debug?: boolean;
};

export class Client extends EventClient {
  #state = createStore<State>({
    connected: false,
    ready: false,
    users: {
      "00000000000000000000000000": {
        _id: "00000000000000000000000000",
        username: "Revolt",
      },
    },
    members: {},
    servers: {},
    channels: {},
    messages: {},
    messageThreads: {},
  });

  user = createMemo(() => {
    const [state] = this.#state;

    return Object.values(state.users).find((user) =>
      user.relationship === RelationshipStatus.User
    );
  });

  #lastPong: number | null = 0;

  // not ideal
  useEvent<K extends keyof ServerMessages>(
    type: K,
    cb: (value: ServerMessages[K]) => void,
  ) {
    this.addEventListener(type, (e) => cb(e.detail as ServerMessages[K]));
  }

  constructor({ debug = false }: ClientOptions = {}) {
    super();
    this.debug = debug;

    const [state, setState] = this.#state;

    this.addEventListener("Ready", (e) => {
      const data = e.detail;
      setState((prev) => ({
        ready: true,
        users: { ...prev.users, ...collect(data.users) },
        servers: collect(data.servers),
        channels: collect(data.channels),
      }));
    });

    this.addEventListener("Message", (e) => {
      const msg = e.detail;

      setState("messages", msg._id, msg);
      setState("messageThreads", msg.channel, (th) => [msg._id, ...th]);
    });

    this.addEventListener("MessageUpdate", (e) => {
      const msg = e.detail;

      setState("messages", msg.id, msg.data);
    });

    this.addEventListener("MessageDelete", (e) => {
      const msg = e.detail;

      setState(
        "messageThreads",
        msg.channel,
        (msgs) => msgs.filter((id) => id !== msg.id),
      );
      setState("messages", { [msg.id]: undefined });
    });

    this.addEventListener("ServerUpdate", (e) => {
      const server = e.detail;

      setState("servers", server.id, server.data);
    });

    this.addEventListener("ChannelUpdate", (e) => {
      const channel = e.detail;
      setState("channels", channel.id, channel.data);
    });

    this.addEventListener("ServerMemberUpdate", (e) => {
      const member = e.detail;

      setState("members", `${member.id.user}@${member.id.server}`, member.data);
    });

    this.addEventListener("ServerRoleUpdate", (e) => {
      const role = e.detail;

      setState("servers", role.id, "roles", role.role_id, role.data);
    });

    const heartbeat = setInterval(() => {
      if (this.#lastPong === null) {
        setState({ connected: false });
        console.debug("[ws]", "No pong recieved.");
      } else {
        setState({ connected: true });
      }
      this.#lastPong = null;
      this.send("Ping", { data: Date.now() });
    }, 10_000);

    this.addEventListener("Pong", (e) => this.#lastPong = e.detail.data);
  }

  config?: RevoltConfiguration;
  connect() {
    return new Promise(async (res) => {
      this.config ??= await queryInfo();
      super.connect(new WebSocket(this.config.ws));
      this.ws!.addEventListener("open", res);

      this.ws!.onclose = () => {
        if (this.debug) {
          console.debug(
            `[ws]`,
            `Lost connection, attempting to reconnect in one second.`,
          );
        }
        setTimeout(() => this.connect().then(res), 1000);
      };
    });
  }

  authenticate(token: string) {
    return new Promise<IncomingMessage<"Authenticated">>((res) => {
      this.addEventListener("Authenticated", res);
      this.send("Authenticate", { token });
    });
  }

  // todo: sendMessage
  // todo: per-view modular global state

  async fetchUser(userId: Id) {
    const [state, setState] = this.#state;

    if (userId in state.users) {
      return state.users[userId];
    } else {
      const user = await fetchUser(userId);
      setState("users", userId, user);
      return user;
    }
  }

  async fetchMessages<T extends boolean = false>(
    channelId: Id,
    options: FetchOptions<T> = {},
  ) {
    const [state, setState] = this.#state;
    const data = await fetchMessages(channelId, options);
    let msgs: Message[] = [];

    if (options.include_users == true) {
      const { messages, users, members } = data as RetrievedMessages<true>;

      setState("users", collect(users));

      if (members) {
        setState(
          "members",
          groupBy(members, (m) => `${m._id.user}@${m._id.server}`),
        );
      }

      msgs = messages;
    } else {
      msgs = data as RetrievedMessages<false>;
    }

    setState("messages", collect(msgs));
    const thread = msgs.map((m) => m._id);

    if (options.before) {
      setState(
        "messageThreads",
        channelId,
        (t = []) =>
          t.concat(thread).sort((a, b) =>
            ulid.decodeTime(b) - ulid.decodeTime(a)
          ),
      );
    } else {
      setState(
        "messageThreads",
        channelId,
        thread,
      );
    }

    return msgs.length;
  }

  getAvatarUrl(user: DeepReadonly<User>) {
    return user.avatar
      ? generateAttatchmentUrl(user.avatar, user.avatar.metadata)
      : generateDefaultAvatarUrl(user._id);
  }

  getPermissions(channel: DeepReadonly<Channel>) {
    const user = this.user()!;

    switch (channel.channel_type) {
      case "SavedMessages": {
        return U32_MAX;
      }
      case "DirectMessage": {
        return channel.recipients.some((r) => {
            const relationship = this.state.users[r].relationship;
            return (
              relationship !== RelationshipStatus.Blocked &&
              relationship !== RelationshipStatus.BlockedOther
            );
          })
          ? DEFAULT_PERMISSION_DM
          : 0;
      }
      case "Group": {
        return channel.owner === user._id
          ? DEFAULT_PERMISSION_DM
          : channel.permissions ?? DEFAULT_PERMISSION_DM;
      }
      case "TextChannel":
      case "VoiceChannel": {
        const server = this.state.servers[channel.server];

        if (server.owner === user._id) return U32_MAX;

        const member = this.state.members[`${user._id}@${server._id}`] ??
          { roles: null };

        let perm =
          (channel.default_permissions ?? server.default_permissions[1]);

        return (
          member.roles?.reduce(
            (perm, role) =>
              perm |
              (channel.role_permissions?.[role] ?? 0) |
              (server.roles?.[role].permissions[1] ?? 0),
            perm,
          ) ?? perm
        );
      }
    }
  }

  get state() {
    return this.#state[0];
  }
}
