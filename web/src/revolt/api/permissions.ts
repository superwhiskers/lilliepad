// SPDX-License-Identifier: MIT
// Adapted from https://github.com/revoltchat/revolt.js/blob/6501374ef0e2de04e422e037865e3af0e67b15c2/src/permissions/definitions.ts

import { DeepReadonly } from "solid-js/store";
import { Channel } from "./types/channels";
import { OverrideField } from "./types/permissions";
import { Member, Role, Server } from "./types/servers";
import { RelationshipStatus, User } from "./types/users";

/** Permission against User */
export const UserPermission = {
  Access: 1 << 0,
  ViewProfile: 1 << 1,
  SendMessage: 1 << 2,
  Invite: 1 << 3,
};

/** Permission against Server / Channel */
export const Permission = {
  // Generic permissions

  /**  Manage the channel or channels on the server */
  ManageChannel: 1 << 0,
  /**  Manage the server */
  ManageServer: 1 << 1,
  /**  Manage permissions on servers or channels */
  ManagePermissions: 1 << 2,
  /**  Manage roles on server */
  ManageRole: 1 << 3,

  // % 3 bits reserved

  // Member permissions

  /**  Kick other members below their ranking */
  KickMembers: 1 << 6,
  /**  Ban other members below their ranking */
  BanMembers: 1 << 7,
  /**  Timeout other members below their ranking */
  TimeoutMembers: 1 << 8,
  /**  Assign roles to members below their ranking */
  AssignRoles: 1 << 9,
  /**  Change own nickname */
  ChangeNickname: 1 << 10,
  /**  Change or remove other's nicknames below their ranking */
  ManageNicknames: 1 << 11,
  /**  Change own avatar */
  ChangeAvatar: 1 << 12,
  /**  Remove other's avatars below their ranking */
  RemoveAvatars: 1 << 13,

  // % 7 bits reserved

  // Channel permissions

  /**  View a channel */
  ViewChannel: 1 << 20,
  /**  Read a channel's past message history */
  ReadMessageHistory: 1 << 21,
  /**  Send a message in a channel */
  SendMessage: 1 << 22,
  /**  Delete messages in a channel */
  ManageMessages: 1 << 23,
  /**  Manage webhook entries on a channel */
  ManageWebhooks: 1 << 24,
  /**  Create invites to this channel */
  InviteOthers: 1 << 25,
  /**  Send embedded content in this channel */
  SendEmbeds: 1 << 26,
  /**  Send attachments and media in this channel */
  UploadFiles: 1 << 27,
  /**  Masquerade messages using custom nickname and avatar */
  Masquerade: 1 << 28,

  // % 1 bits reserved

  // Voice permissions

  /**  Connect to a voice channel */
  Connect: 1 << 30,
  /**  Speak in a voice call */
  Speak: 1 << 31,
  /**  Share video in a voice call */
  Video: 1 << 32,
  /**  Mute other members with lower ranking in a voice call */
  MuteMembers: 1 << 33,
  /**  Deafen other members with lower ranking in a voice call */
  DeafenMembers: 1 << 34,
  /**  Move members between voice channels */
  MoveMembers: 1 << 35,

  // * Misc. permissions
  // % Bits 36 to 52: free area
  // % Bits 53 to 64: do not use

  // * Grant all permissions
  /**  Safely grant all permissions */
  GrantAllSafe: 0x000f_ffff_ffff_ffff,
};

/** Maximum safe value */
export const U32_MAX = 2 ** 32 - 1; // 4294967295

/** Default permissions if we can only view */
export const DEFAULT_PERMISSION_VIEW_ONLY =
  Permission.ViewChannel + Permission.ReadMessageHistory;

/** Default base permissions for channels */
export const DEFAULT_PERMISSION =
  DEFAULT_PERMISSION_VIEW_ONLY +
  Permission.SendMessage +
  Permission.InviteOthers +
  Permission.SendEmbeds +
  Permission.UploadFiles +
  Permission.Connect +
  Permission.Speak;

/** Permissions in saved messages channel */
export const DEFAULT_PERMISSION_SAVED_MESSAGES = Permission.GrantAllSafe;

/** Permissions in direct message channel */
export const DEFAULT_PERMISSION_DIRECT_MESSAGE =
  DEFAULT_PERMISSION + Permission.ManageChannel;

/** Permissions in server text / voice channel */
export const DEFAULT_PERMISSION_SERVER =
  DEFAULT_PERMISSION + Permission.ChangeNickname + Permission.ChangeAvatar;

export const roleSortFn = (a: Role, b: Role) =>
  (a.rank ?? 0) - (b.rank ?? 0)

export const applyOverride = (perm: number, override: OverrideField) =>
  (perm | override.a) & override.d

// export const calculateServerPermissions = (server: Readonly<Server>, member?: Readonly<Member>) => {
//   if (!member) return 0
//   if (server.owner === member._id.user) return Permission.GrantAllSafe
//   let permissions = server.default_permissions
//   if (member.roles && server.roles) {
//     const roles = orderRoles(member.roles.map(id => server.roles![id])).map(role => role.permissions[0])
//     permissions = roles.reduce((prev, curr) => prev | curr, permissions)

//   }
//   return permissions
// }

// export const calculateChannelPermissions = (channel: Readonly<Channel>, member?: Readonly<Member>) => {
//   if (!member) return 0
//   switch (channel.channel_type) {
//     case "SavedMessages": return Permission.GrantAllSafe
//     case "DirectMessage": channel.recipients.filter(id => id != member._id.user)[0]
//   }
// }

// export const calculateRelationshipPermissions = (user: Readonly<User>): number => {
//   switch (user.relationship) {
//     case RelationshipStatus.User:
//     case RelationshipStatus.Friend:
//       return U32_MAX

//     case RelationshipStatus.Blocked:
//     case RelationshipStatus.BlockedOther:
//       return UserPermission.Access

//     case RelationshipStatus.None:
//     case RelationshipStatus.Outgoing:
//     case RelationshipStatus.Incoming:
//       return UserPermission.Access

//     default:
//       throw new Error(`Unknown user relationship: '${user.relationship}'`)
//   }
// }