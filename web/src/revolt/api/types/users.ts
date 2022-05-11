import type { File } from "./autumn";
import type { Id } from "./common";

/**
 * Username
 * @minLength 2
 * @maxLength 32
 * @pattern ^[a-zA-Z0-9_.]+$
 */
export type Username = string;

/**
 * Your relationship with the user
 */
export enum RelationshipStatus {
  None = "None",
  User = "User",
  Friend = "Friend",
  Outgoing = "Outgoing",
  Incoming = "Incoming",
  Blocked = "Blocked",
  BlockedOther = "BlockedOther",
}

export type RelationshipOnly = {
  status: RelationshipStatus;
};

export type Relationship = RelationshipOnly & {
  /**
   * Other user's ID
   */
  _id: Id;
};

/**
 * User presence
 */
export enum Presence {
  Online = "Online",
  Idle = "Idle",
  Busy = "Busy",
  Invisible = "Invisible",
}

/**
 * User status
 */
export type Status = {
  /**
   * Custom status text
   * @minLength 1
   * @maxLength 128
   */
  text?: string;

  presence?: Presence;
};

export enum Badges {
  Developer = 1,
  Translator = 2,
  Supporter = 4,
  ResponsibleDisclosure = 8,
  Founder = 16,
  PlatformModeration = 32,
  ActiveSupporter = 64,
  Paw = 128,
  EarlyAdopter = 256,
  ReservedRelevantJokeBadge1 = 512,
}

/**
 * Bot information
 */
export interface BotInformation {
  /**
   * The User ID of the owner of this bot
   */
  owner: Id;
}

export interface User {
  /**
   * User ID
   */
  _id: Id;

  username: Username;

  /**
   * User avatar
   */
  avatar?: File & { metadata: { type: "Image" } };

  /**
   * Relationships with other known users
   * Only present if fetching self
   */
  relations?: Relationship[];

  /**
   * Bitfield of user's badges
   *
   * `1`: Developer
   * `2`: Translator
   * `4`: Supporter
   * `8`: Responsible Disclosure
   * `16`: Founder
   * `32`: Platform Moderation
   * `64`: Active Supporter
   * `128`: Paw
   * `256`: Early Adopter
   * `512`: Reserved Relevant Joke Badge 1
   */
  badges?: number;

  status?: Status;

  /**
   * Relationship to user
   */
  relationship?: RelationshipStatus;

  /**
   * Whether the user is online
   */
  online?: boolean;

  /**
   * User flags
   *
   * `1`: Account is suspended
   * `2`: Account was deleted
   * `4`: Account is banned
   */
  flags?: number;

  /**
   * Bot information, present if user is a bot.
   */
  bot?: BotInformation;
}

export interface Profile {
  /**
   * Profile content
   * @minLength 0
   * @maxLength 2000
   */
  content?: string;

  /**
   * Profile background
   */
  background?: File;
}
