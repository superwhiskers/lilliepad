import type { AutumnId, Id, Nonce } from "./common";
import type { Attachment } from "./autumn";
import type { JanuaryEmbed } from "./january";
import { User } from "./users";
import { Member } from "./servers";

/**
 * Masquerade displayed for a message.
 * Replaces user's name and avatar.
 */
export type Masquerade = {
  /**
   * Nickname to display
   */
  name?: string;

  /**
   * Avatar URL
   */
  avatar?: string;
};

export type Message = {
  /**
   * Message Id
   */
  _id: Id;

  nonce?: Nonce;

  /**
   * Channel Id
   */
  channel: Id;

  /**
   * Author Id
   */
  author: Id;

  /**
   * Message content, can be an object *only* if sent by the system user.
   */
  content: string | SystemMessage;

  /**
   * Message attachments
   */
  attachments?: Attachment[];

  /**
   * Unix timestamp of when message was last edited
   */
  edited?: { $date: string };

  /**
   * Message link embeds
   */
  embeds?: Embed[];

  /**
   * Array of user IDs mentioned in message
   */
  mentions?: Id[];

  /**
   * Array of message IDs replied to
   */
  replies?: Id[];

  masquerade?: Masquerade;
};

export type SystemMessage =
  | { type: "text"; content: string }
  | { type: "user_added"; id: Id; by: Id }
  | { type: "user_remove"; id: Id; by: Id }
  | { type: "user_joined"; id: Id }
  | { type: "user_left"; id: Id }
  | { type: "user_kicked"; id: Id }
  | { type: "user_banned"; id: Id }
  | { type: "channel_renamed"; name: string; by: Id }
  | { type: "channel_description_changed"; by: Id }
  | { type: "channel_icon_changed"; by: Id };

export type TextEmbed = {
  type: "Text";

  icon_url?: string;
  url?: string;
  title?: string;
  description?: string;
  media?: Attachment;
  colour?: string;
};

export type Embed = TextEmbed | JanuaryEmbed | { type: "None" };

export type SendableEmbed = {
  type: "Text";

  icon_url?: string;
  url?: string;
  title?: string;
  description?: string;
  media?: string;
  colour?: string;
};

export interface SendMessage {
  /**
   * Message content to send.
   * @minLength 0
   * @maxLength 2000
   */
  content: string;
  /**
   * Attachments to include in message.
   */
  attachments?: AutumnId[];
  /**
   * Embeds to include in the message
   * @minLength 1
   * @maxLength 10
   */
  embeds?: SendableEmbed[];
  /**
   * Messages to reply to.
   */
  replies?: {
    /**
     * Message Id
     */
    id: Id;

    /**
     * Whether this reply should mention the message's author.
     */
    mention: boolean;
  }[];
  masquerade?: Masquerade;
}

export type FetchOptions<IncludeUsers extends boolean> = {
  /**
   * Maximum number of messages to fetch.
   *
   * For fetching nearby messages, this is \`(limit + 1)\`.
   *
   * @minimum 1
   * @maximum 100
   */
  limit?: number;
  /**
   * Message id before which messages should be fetched.
   */
  before?: Id;
  /**
   * Message id after which messages should be fetched.
   */
  after?: Id;
  /**
   * Message sort direction
   */
  sort?: "Latest" | "Oldest";
  /**
   * Message id to fetch around, this will ignore 'before', 'after' and 'sort' options.
   * Limits in each direction will be half of the specified limit.
   * It also fetches the specified message ID.
   */
  nearby?: Id;
  /**
   * Whether to include user (and member, if server channel) objects.
   */
  include_users?: IncludeUsers;
};

export type RetrievedMessages<IncludeUsers extends boolean> = IncludeUsers extends true
  ? { messages: Message[], users: User[], members?: Member[] }
  : Message[]
