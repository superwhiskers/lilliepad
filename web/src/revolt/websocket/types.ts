import { Id } from "../api/types/common";

import { User } from "../api/types/users";
import { Member, MemberCompositeKey, Role, Server } from "../api/types/servers";
import { Channel } from "../api/types/channels";
import { Message } from "../api/types/messages";

export type ClientMessages = {
  "Authenticate": { token: string };
  "BeginTyping": { channel: Id };
  "EndTyping": { channel: Id };
  "Ping": {
    /** data / timestamp to recieve back */
    data: number;
  };
};

export type EventErrorType =
  | "LabelMe"
  | "InternalError"
  | "InvalidSession"
  | "OnboardingNotFinished"
  | "OnboardingNotFinished";

export type ServerMessages = {
  "Error": { error: EventErrorType };
  "Authenticated": Record<never, never>;
  "Pong": { data: number };
  "Ready": {
    users: User[];
    servers: Server[];
    channels: Channel[];
  };
  "Message": Message;
  "MessageUpdate": { id: Id; data: Partial<Message> };
  "MessageDelete": { id: Id; channel: Id };
  "ChannelStartTyping": { id: Id; user: Id };
  "ChannelStopTyping": { id: Id; user: Id };

  "ChannelUpdate": {
    id: Id;
    data: Partial<Channel>;
    clear?: "Icon" | "Description";
  };

  "ServerUpdate": {
    id: Id;
    data: Partial<Server>;
    clear?: "Icon" | "Banner" | "Description";
  };

  "ServerMemberUpdate": {
    id: MemberCompositeKey;
    data: Partial<Member>;
    clear?: "Nickname" | "Avatar";
  };

  "ServerRoleUpdate": {
    id: Id,
    role_id: Id,
    data: Partial<Role>
    clear?: "Colour"
  }
};
