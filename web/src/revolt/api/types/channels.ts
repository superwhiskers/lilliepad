import type { Id } from "./common";
import type { File } from "./autumn";
import type { OverrideField } from './permissions'

// todo: permissions

export type GenericServerChannel = {
  /** @description Unique Id */
  _id: string;

  /** @description Id of the server this channel belongs to */
  server: string;

  /** @description Display name of the channel */
  name: string;

  /** @description Channel description */
  description?: string | null;

  /** @description Custom icon attachment */
  icon?: File | null;

  /** @description Default permissions assigned to users in this channel */
  default_permissions?: OverrideField | null;

  /** @description Permissions assigned based on role to this channel */
  role_permissions?: {
    [key: string]: OverrideField;
  };

  /** @description Whether this channel is marked as not safe for work */
  nsfw?: boolean;
};


/**
 * Saved Messages channel has only one participant, the user who created it.
 */
export type SavedMessagesChannel = {
  /** @enum {string} */
  channel_type: "SavedMessages";

  /** @description Unique Id */
  _id: Id;

  /** @description Id of the user this channel belongs to */
  user: Id;
};

export type DirectMessageChannel = {
  /** @enum {string} */
  channel_type: "DirectMessage";

  /** @description Unique Id */
  _id: Id;

  /** @description Whether this direct message channel is currently open on both sides */
  active: boolean;

  /** @description 2-tuple of user ids participating in direct message */
  recipients: [Id, Id];

  /** @description Id of the last message sent in this channel */
  last_message_id?: Id | null;

};

export type GroupChannel = {
  /** @enum {string} */
  channel_type: "Group";

  /** @description Unique Id */
  _id: Id;

  /** @description Display name of the channel */
  name: string;

  /** @description User id of the owner of the group */
  owner: Id;

  /** @description Channel description */
  description?: string | null;

  /** @description Array of user ids participating in channel */
  recipients: Id[];

  /** @description Custom icon attachment */
  icon?: File | null;

  /** @description Id of the last message sent in this channel */
  last_message_id?: Id | null;

  /**
   * Format: int64
   * @description Permissions assigned to members of this group (does not apply to the owner of the group)
   */
  permissions?: number | null;

  /** @description Whether this group is marked as not safe for work */
  nsfw?: boolean;
};

export type TextChannel = GenericServerChannel & {
  /** @enum {string} */
  channel_type: "TextChannel";

  /** @description Id of the last message sent in this channel */
  last_message_id?: string | null;

};

export type VoiceChannel = GenericServerChannel & {
  /** @enum {string} */
  channel_type: "VoiceChannel";
};

export type Channel = (
  | SavedMessagesChannel
  | DirectMessageChannel
  | GroupChannel
  | TextChannel
  | VoiceChannel
);
