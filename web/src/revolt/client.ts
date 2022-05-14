import { queryInfo } from "./api/core";
import { RevoltConfiguration } from "./api/types/core";
import { EventClient, IncomingMessage } from "./websocket/client";
import { createStore, DeepReadonly } from "solid-js/store";
import { Id } from "./api/types/common";
import { RelationshipStatus, User } from "./api/types/users";
import { Member, Server } from "./api/types/servers";
import { Channel, GenericServerChannel } from "./api/types/channels";
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
import * as ulid from "ulid";
import { applyOverride, DEFAULT_PERMISSION_DIRECT_MESSAGE, Permission, roleSortFn, U32_MAX, UserPermission } from "./api/permissions";

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
  #missedPongs = 0

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
        this.#missedPongs += 1
        if(this.#missedPongs > 3) {
          this.#missedPongs = 0
          console.debug("[ws]", "3 Missed pongs, attempting to reconnect... TODO")
          this.ws!.close()
        }
      } else {
        this.#missedPongs = 0
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

      users.forEach(user => {
        setState("users", user._id, user);
      })

      if (members) {
        members.forEach(member => {
          setState(
            "members",
            `${member._id.user}@${member._id.server}`,
            member
          );
        })
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
    return this.calculateChannelPermissions(channel, user)
  }

  calculateServerPermissions(server: DeepReadonly<Server>, member?: DeepReadonly<Member>) {
    if (!member) return 0
    if (server.owner === member._id.user) return Permission.GrantAllSafe
    let perms = server.default_permissions
    if (member.roles && server.roles) {
      const roles = member.roles.map(id => server.roles![id]);
      perms = roles
        .sort(roleSortFn)
        .map(role => role.permissions)
        .reduce(applyOverride, perms)
    }
    return perms
  }

  // not entirely sure if this is correct
  calculateChannelPermissions(channel: DeepReadonly<Channel>, user?: DeepReadonly<User>) {
    const [state] = this.#state

    if (!user) return 0

    switch (channel.channel_type) {
      case "SavedMessages": return Permission.GrantAllSafe
      case "DirectMessage": {
        const id = channel.recipients.filter(id => id != user._id)[0]
        const recipient = state.users[id]
        return this.calculateRelationshipPermissions(recipient)
      }
      case "Group": {
        return channel.owner === user._id
          ? DEFAULT_PERMISSION_DIRECT_MESSAGE
          : channel.permissions ?? DEFAULT_PERMISSION_DIRECT_MESSAGE
      }
      case "TextChannel":
      case "VoiceChannel":
        const server = state.servers[channel.server]

        if (server.owner === user._id) {
          return Permission.GrantAllSafe
        }

        const member = this.getMember(user._id, server._id)
        if (!member) return 0

        let perms = this.calculateServerPermissions(server, member)
        if (channel.default_permissions) perms = applyOverride(perms, channel.default_permissions)
        if (member.roles && channel.role_permissions && server.roles) {
          const overrides = member.roles.map(id => [id, server.roles![id]] as const)
            .sort((a, b) => roleSortFn(a[1], b[1]))
            .map(role => channel.role_permissions![role[0]])

          perms = overrides.reduce(applyOverride, perms)
        }

        return perms
    }
  }

  calculateRelationshipPermissions = (user: DeepReadonly<User>): number => {
    const [state] = this.#state

    switch (user.relationship) {
      case RelationshipStatus.User:
      case RelationshipStatus.Friend:
        return U32_MAX

      case RelationshipStatus.Blocked:
      case RelationshipStatus.BlockedOther:
        return UserPermission.Access

      case RelationshipStatus.Outgoing:
      case RelationshipStatus.Incoming:
        return UserPermission.Access

      case RelationshipStatus.None: {
        let perm = UserPermission.Access

        if (state.users[user._id]) {
          if (user.bot) {
            perm |= UserPermission.SendMessage
          }
          perm |= UserPermission.ViewProfile
        }

        return perm
      }

      default:
        throw new Error(`Unknown user relationship: '${user.relationship}'`)
    }
  }

  getMember(userId: Id, serverId: Id): DeepReadonly<Member> | undefined {
    return this.state.members[`${userId}@${serverId}`]
  }

  get state() {
    return this.#state[0];
  }
}
