/**
 * Attachment ID
 * @minLength 1
 * @maxLength 128
 */
export type FileId = string;

export type ImageMetadata =
  { type: "Image"; width: number; height: number }

export type VideoMetadata =
  { type: "Video"; width: number; height: number }

export type FileMetadata = (
  | { type: "File" }
  | { type: "Text" }
  | { type: "Audio" }
  | ImageMetadata
  | VideoMetadata
);

/**
 * Attachment tag
 */
export type FileTag =
  | "attachments"
  | "avatars"
  | "backgrounds"
  | "icons"
  | "banners";

export type File = {
  /** @description Unique Id */
  _id: FileId;

  /** @description Tag / bucket this file was uploaded to */
  tag: FileId;

  /** @description Original filename */
  filename: string;

  /** @description Parsed metadata of this file */
  metadata: FileMetadata;

  /** @description Raw content type of this file */
  content_type: string;

  /**
   * Format: int
   * @description Size of this file (in bytes)
   */
  size: number;

  /** @description Whether this file was deleted */
  deleted?: boolean;

  /** @description Whether this file was reported */
  reported?: boolean;

  message_id?: string;
  user_id?: string;
  server_id?: string;

  /** @description Id of the object this file is associated with */
  object_id?: string;

};

/**
 * File serving parameters
 */
export interface SizeOptions {
  /**
   * Width of resized image
   */
  width?: number;

  /**
   * Height of resized image
   */
  height?: number;

  /**
   * Width and height of resized image
   */
  size?: number;

  /**
   * Maximum resized image side length
   */
  max_side?: number;
}
