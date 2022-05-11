import type { File } from "./autumn";
import type { Id } from "./common";
import { OverrideField } from "./permissions";

/** @description Composite primary key consisting of server and user id */
export type MemberCompositeKey = {
  /** @description Server Id */
  server: Id;

  /** @description User Id */
  user: Id;
};

export type Member = {
  /** @description Unique member id */
  _id: MemberCompositeKey;

  /** @description Member's nickname */
  nickname?: string;

  /** @description Avatar attachment */
  avatar?: File;

  /** @description Member's roles */
  roles?: Id[];
};

export type Ban = {
  _id: MemberCompositeKey;
  reason?: string;
};


/**
 * Valid HTML colour
 *
 * Warning: This is untrusted input, do not simply insert this anywhere.
 *
 * **Example usage:**
 * ```js
 * document.body.style.color = role.colour;
 * ```
 *
 * @minLength 1
 * @maxLength 32
 */
export type Colour = string;

export type Role = {
  /**
   * Role name
   * @minLength 1
   * @maxLength 32
   */
  name: string;

  /** @description Permissions available to this role */
  permissions: OverrideField;

  /**
   * @description Colour used for this role
   *
   * This can be any valid CSS colour
   */
  colour?: Colour;

  /** @description Whether this role should be shown separately on the member sidebar */
  hoist?: boolean;

  /**
   * Format: int64
   * @description Ranking of this role
   */
  rank?: number;
};

export type RoleInformation = Pick<Role, "name" | "colour" | "hoist" | "rank">;

export type Category = {
  id: Id;

  title: string;

  channels: string[];
};

export type SystemMessageChannels = {
  /** Channel ID where user join events should be sent */
  user_joined?: Id;

  /** Channel ID where user leave events should be sent */
  user_left?: Id;

  /** Channel ID where user kick events should be sent */
  user_kicked?: Id;

  /** Channel ID where user ban events should be sent */
  user_banned?: Id;
};

export type Server = {
  /** @description Unique Id */
  _id: string;

  /** @description User id of the owner */
  owner: string;

  /** @description Name of the server */
  name: string;

  /** @description Description for the server */
  description?: string | null;

  /** @description Channels within this server */
  channels: string[];

  /** @description Categories for this server */
  categories?: Category[] | null;

  /** @description Configuration for sending system event messages */
  system_messages?: SystemMessageChannels | null;

  /** @description Roles for this server */
  roles?: { [key: string]: Role };

  /**
   * Format: int64
   * @description Default set of server and channel permissions
   */
  default_permissions: number;

  /** @description Icon attachment */
  icon?: File | null;

  /** @description Banner attachment */
  banner?: File | null;

  /**
   * Format: int32
   * @description Enum of server flags
   */
  flags?: number | null;

  /** @description Whether this server is flagged as not safe for work */
  nsfw?: boolean;

  /** @description Whether to enable analytics */
  analytics?: boolean;

  /** @description Whether this server should be publicly discoverable */
  discoverable?: boolean;
};
