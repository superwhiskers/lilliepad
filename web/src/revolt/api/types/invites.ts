import type { File } from "./autumn";
import type { Id } from "./common";
import type { Server } from "./servers";
import type { Channel } from "./channels";

export type ServerInvite = {
  type: "Server";

  /**
   * Invite Code
   */
  _id: Id;

  /**
   * ID of the server this invite is for.
   */
  server: Id;

  /**
   * ID of the user who created this invite.
   */
  creator: Id;

  /**
   * ID of the channel this invite is for.
   */
  channel: Id;
};

export type Invite = ServerInvite;

export type RetrievedInvite = {
  type: "Server";
  server_id: Id;
  server_name: string;
  server_icon?: File;
  server_banner?: File;
  channel_id: Id;
  channel_name: string;
  channel_description?: string;
  user_name: string;
  user_avatar?: File;
  member_count: number;
};

export type InviteResponse = {
  type: "Server";
  channel: Channel;
  server: Server;
};
