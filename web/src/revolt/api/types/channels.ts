import type { Id } from "./common";
import type { Attachment } from "./autumn";

/**
 * Saved Messages channel has only one participant, the user who created it.
 */
export type SavedMessagesChannel = {
  /**
   * Channel Id
   */
  _id: Id;

  channel_type: "SavedMessages";

  /**
   * User Id
   */
  user: Id;
};

export type DirectMessageChannel = {
  /**
   * Channel Id
   */
  _id: Id;

  channel_type: "DirectMessage";

  /**
   * Whether this DM is active
   */
  active: boolean;

  /**
   * List of user IDs who are participating in this DM
   */
  recipients: Id[];

  /**
   * Id of the last message in this channel
   */
  last_message_id?: Id;
};

export type GroupChannel = {
  /**
   * Channel Id
   */
  _id: Id;

  channel_type: "Group";

  /**
   * List of user IDs who are participating in this group
   */
  recipients: Id[];

  /**
   * Group name
   */
  name: string;

  /**
   * User ID of group owner
   */
  owner: Id;

  /**
   * Group description
   */
  description?: string;

  /**
   * Id of the last message in this channel
   */
  last_message_id?: Id;

  /**
   * Group icon
   */
  icon?: Attachment;

  /**
   * Permissions given to group members
   */
  permissions?: number;

  /**
   * Whether this channel is marked as not safe for work
   */
  nsfw?: boolean;
};

export type ServerChannel = {
  /**
   * Channel Id
   */
  _id: Id;

  /**
   * Server Id
   */
  server: Id;

  /**
   * Channel name
   */
  name: string;

  /**
   * Channel description
   */
  description?: string;

  icon?: Attachment;

  /**
   * Permissions given to all users
   */
  default_permissions?: number;

  /**
   * Permissions given to roles
   */
  role_permissions?: {
    [key: string]: number;
  };

  /**
   * Whether this channel is marked as not safe for work
   */
  nsfw?: boolean;
};

export type TextChannel = ServerChannel & {
  channel_type: "TextChannel";

  /**
   * Id of the last message in this channel
   */
  last_message_id?: Id;
};

export type VoiceChannel = ServerChannel & {
  channel_type: "VoiceChannel";
};

export type Channel = (
  | SavedMessagesChannel
  | DirectMessageChannel
  | GroupChannel
  | TextChannel
  | VoiceChannel
);
