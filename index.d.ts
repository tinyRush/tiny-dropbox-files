/// <reference types="multer" />
import { Request, Response } from 'express';

interface IFilesListFolderArg {
  /** 
   * The path to the folder you want to see the contents of.
   */
  path: string;
  /**
   * If true, the list folder operation will be applied recursively to all subfolders and the response will contain contents of all subfolders.
   */
  recursive?: boolean;
  /**
   * If true, FileMetadata.media_info is set for photo and video.
   */
  include_media_info?: boolean;
  /**
   * If true, the results will include entries for files and folders that used to exist but were deleted.
   */
  include_deleted?: boolean;
  /**
   * If true, the results will include a flag for each file indicating whether or not that file has any explicit members.
   */
  include_has_explicit_shared_members?: boolean;
}

interface IFilesDimensions {
  /**
   * Height of the photo/video.
   */
  height: number;
  /**
   * Width of the photo/video.
   */
  width: number;
}

interface IFilesGpsCoordinates {
  /**
   * 	Latitude of the GPS coordinates.
   */
  latitude: number;
  /**
   * Longitude of the GPS coordinates.
   */
  longitude: number;
}

interface IFilesVideoMetadata {
  /**
   * Tag identifying this subtype variant. This field is only present when needed to discriminate between multiple possible subtypes.
   */
  '.tag'?: 'video';
  /**
   * Dimension of the photo/video.
   */
  dimensions?: IFilesDimensions;
  /**
   * The GPS coordinate of the photo/video.
   */
  location?: IFilesGpsCoordinates;
  /**
   * The timestamp when the photo/video is taken.
   */
  time_taken?: string;
  /**
   * The duration of the video in milliseconds.
   */
  duration?: number;
}

interface IFilesPhotoMetadata {
  /**
   * Tag identifying this subtype variant. This field is only present when needed to discriminate between multiple possible subtypes.
   */
  '.tag'?: 'photo';
  /**
   * Dimension of the photo/video.
   */
  dimensions?: IFilesDimensions;
  /**
   * The GPS coordinate of the photo/video.
   */
  location?: IFilesGpsCoordinates;
  /**
   * The timestamp when the photo/video is taken.
   */
  time_taken?: string;
}

interface IFilesMediaInfo {
  /**
   * Available if .tag is metadata. The metadata for the photo/video.
   */
  metadata?: IFilesPhotoMetadata | IFilesVideoMetadata;
  /**
   * Tag identifying the union variant.
   */
  '.tag': 'pending' | 'metadata';
}

interface IFilesFileSharingInfo {
  /**
   * True if the file or folder is inside a read-only shared folder.
   */
  read_only: boolean;
  /**
   * ID of shared folder that holds this file.
   */
  parent_shared_folder_id: string;
  /**
   * The last user who modified the file. This field will be null if the user's account has been deleted.
   */
  modified_by?: string;
}

interface IPropertiesPropertyField {
  /**
   * This is the name or key of a custom property in a property template. File property names can be up to 256 bytes.
   */
  name: string;
  /**
   * Value of a custom property attached to a file. Values can be up to 1024 bytes.
   */
  value: string;
}

interface IPropertiesPropertyGroup {
  /**
   * A unique identifier for a property template type.
   */
  template_id: string;
  /**
   * This is a list of custom properties associated with a file. There can be up to 32 properties for a template.
   */
  fields: [IPropertiesPropertyField];
}

interface IFilesFileMetadata {
  /**
   * Tag identifying this subtype variant. This field is only present when needed to discriminate between multiple possible subtypes.
   */
  '.tag'?: string;
  /**
   * 	The last component of the path (including extension). This never contains a slash.
   */
  name: string;
  /**
   * A unique identifier for the file.
   */
  id: string;
  /**
   * For files, this is the modification time set by the desktop client when the file was added to Dropbox. Since this time is not verified (the Dropbox server stores whatever the desktop client sends up), this should only be used for display purposes (such as sorting) and not, for example, to determine if a file has changed or not.
   */
  client_modified: string;
  /**
   * 	The last time the file was modified on Dropbox.
   */
  server_modified: string;
  /**
   * A unique identifier for the current revision of a file. This field is the same rev as elsewhere in the API and can be used to detect changes and avoid conflicts.
   */
  rev: string;
  /**
   * 	The file size in bytes.
   */
  size: number;
  /**
   * The lowercased full path in the user's Dropbox. This always starts with a slash. This field will be null if the file or folder is not mounted.
   */
  path_lower?: string;
  /**
   * The cased path to be used for display purposes only. In rare instances the casing will not correctly match the user's filesystem, but this behavior will match the path provided in the Core API v1, and at least the last path component will have the correct casing. Changes to only the casing of paths won't be returned by list_folder/continue. This field will be null if the file or folder is not mounted.
   */
  path_display?: string;
  /**
   * Deprecated. Please use FileSharingInfo.parent_shared_folder_id or FolderSharingInfo.parent_shared_folder_id instead.
   */
  parent_shared_folder_id?: string;
  /**
   * Additional information if the file is a photo or video.
   */
  media_info?: IFilesMediaInfo;
  /**
   * Set if this file is contained in a shared folder.
   */
  sharing_info?: IFilesFileSharingInfo;
  /**
   * Additional information if the file has custom properties with the property template specified.
   */
  property_groups?: [IPropertiesPropertyGroup];
  /**
   * This flag will only be present if include_has_explicit_shared_members is true in list_folder or get_metadata. If this flag is present, it will be true if this file has any explicit shared members. This is different from sharing_info in that this could be true in the case where a file has explicit members but is not contained within a shared folder.
   */
  has_explicit_shared_members?: boolean;
  /**
   * A hash of the file content. This field can be used to verify data integrity. For more information see our Content hash /developers/reference/content-hash page.
   */
  content_hash?: string;
  /**
   * File binary when download
   */
  fileBinary?: string;
}

interface IFilesFolderSharingInfo {
  /**
   * True if the file or folder is inside a read-only shared folder.
   */
  read_only: boolean;
  /**
   * Set if the folder is contained by a shared folder.
   */
  parent_shared_folder_id?: string;
  /**
   * If this folder is a shared folder mount point, the ID of the shared folder mounted at this location.
   */
  shared_folder_id?: string;
  /**
   * Specifies that the folder can only be traversed and the user can only see a limited subset of the contents of this folder because they don't have read access to this folder. They do, however, have access to some sub folder.
   */
  traverse_only: boolean;
  /**
   * Specifies that the folder cannot be accessed by the user.
   */
  no_access: boolean;
}

interface IFilesFolderMetadata {
  /**
   * Tag identifying this subtype variant. This field is only present when needed to discriminate between multiple possible subtypes.
   */
  '.tag'?: 'folder';
  /**
   * The last component of the path (including extension). This never contains a slash.
   */
  name: string;
  /**
   * A unique identifier for the folder.
   */
  id: string;
  /**
   * The lowercased full path in the user's Dropbox. This always starts with a slash. This field will be null if the file or folder is not mounted.
   */
  path_lower?: string;
  /**
   * The cased path to be used for display purposes only. In rare instances the casing will not correctly match the user's filesystem, but this behavior will match the path provided in the Core API v1, and at least the last path component will have the correct casing. Changes to only the casing of paths won't be returned by list_folder/continue. This field will be null if the file or folder is not mounted.
   */
  path_display?: string;
  /**
   * Deprecated. Please use FileSharingInfo.parent_shared_folder_id or FolderSharingInfo.parent_shared_folder_id instead.
   */
  parent_shared_folder_id?: string;
  /**
   * Deprecated. Please use sharing_info instead.
   */
  shared_folder_id?: string;
  /**
   * Set if the folder is contained in a shared folder or is a shared folder mount point.
   */
  sharing_info?: IFilesFolderSharingInfo;
}

interface IFilesDeletedMetadata {
  /**
   * Tag identifying this subtype variant. This field is only present when needed to discriminate between multiple possible subtypes.
   */
  '.tag'?: 'deleted';
  /**
   * The last component of the path (including extension). This never contains a slash.
   */
  name: string;
  /**
   * The lowercased full path in the user's Dropbox. This always starts with a slash. This field will be null if the file or folder is not mounted.
   */
  path_lower?: string;
  /**
   * The cased path to be used for display purposes only. In rare instances the casing will not correctly match the user's filesystem, but this behavior will match the path provided in the Core API v1, and at least the last path component will have the correct casing. Changes to only the casing of paths won't be returned by list_folder/continue. This field will be null if the file or folder is not mounted.
   */
  path_display?: string;
  /**
   * Deprecated. Please use FileSharingInfo.parent_shared_folder_id or FolderSharingInfo.parent_shared_folder_id instead.
   */
  parent_shared_folder_id?: string;
}

interface IFilesListFolderResult {
  /**
   * The files and (direct) subfolders in the folder.
   */
  entries: [IFilesFileMetadata | IFilesFolderMetadata | IFilesDeletedMetadata];
  /**
   * Pass the cursor into list_folder/continue to see what's changed in the folder since your previous query.
   */
  cursor: string;
  /**
   * 	If true, then there are more entries available. Pass the cursor to list_folder/continue to retrieve the rest.
   */
  has_more: boolean;
}

interface IFilesWriteMode {
  /**
   * Available if .tag is update. Overwrite if the given "rev" matches the existing file's "rev". The autorename strategy is to append the string "conflicted copy" to the file name. For example, "document.txt" might become "document (conflicted copy).txt" or "document (Panda's conflicted copy).txt".
   */
  update?: string;
  /**
   * Tag identifying the union variant.
   */
  '.tag': 'add' | 'overwrite' | 'update';
}

interface IFilesCommitInfo {
  /**
   * 	The file contents to be uploaded.
   */
  contents: Object;
  /**
   * Path in the user's Dropbox to save the file.
   */
  path: string;
  /**
   * Selects what to do if the file already exists.
   */
  mode?: IFilesWriteMode;
  /**
   * If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict.
   */
  autorename?: boolean;
  /**
   * The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified.
   */
  client_modified?: string;
  /**
   * Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification.
   */
  mute?: boolean;
}

interface IFilesDownloadArg {
  /**
   * The path of the file to download.
   */
  path: string;
  /**
   * Deprecated. Please specify revision in path instead.
   */
  rev?: string;
}

interface IFilesThumbnailFormat {
  /**
   * Tag identifying the union variant.
   */
  '.tag': 'jpeg' | 'png' | string;
}

interface IFilesThumbnailSize {
  /**
   * Tag identifying the union variant.
   */
  '.tag': 'w32h32' | 'w64h64' | 'w128h128' | 'w640h480' | 'w1024h768' | string;
}

interface IFilesThumbnailArg {
  /**
   * The path to the image file you want to thumbnail.
   */
  path: string;
  /**
   * The format for the thumbnail image, jpeg (default) or png. For images that are photos, jpeg should be preferred, while png is better for screenshots and digital arts.
   */
  format: IFilesThumbnailFormat;
  /**
   * The size for the thumbnail image.
   */
  size: IFilesThumbnailSize;
}

interface IFilesDeleteArg {
  /**
   * Path in the user's Dropbox to delete.
   */
  path: string;
}

interface IFileModel {
  filesListFolder(arg: IFilesListFolderArg): Promise<IFilesListFolderResult>;
  filesUpload(arg: IFilesCommitInfo): Promise<IFilesFileMetadata>;
  filesDownload(arg: IFilesDownloadArg): Promise<IFilesFileMetadata>;
  filesGetThumbnail(arg: IFilesThumbnailArg): Promise<IFilesFileMetadata>;
  filesDelete(
    arg: IFilesDeleteArg
  ): Promise<IFilesFileMetadata | IFilesFolderMetadata | IFilesDeletedMetadata>;
}

declare class TinyDropboxFilesController {
  private _filesService;
  private _rootFolder;
  constructor(options: { accessToken: string; rootFolder: string });
  doFind(req: Request, res: Response): void;
  doGet(req: Request, res: Response): void;
  doPost(req: Request, res: Response): void;
  doPut(): void;
  doDelete(req: Request, res: Response): void;
  private sendSuccess(res, data);
  private sendFailure(res, response);
}

declare class TinyDropboxFilesService {
  private _dbx;
  constructor(accessToken: string);
  getFilesList(path: string): Promise<IFilesListFolderResult>;
  uploadFiles(
    path: string,
    files: Express.Multer.File []
  ): Promise<IFilesFileMetadata[]>;
  downloadFile(resize: any, path: string): Promise<Buffer>;
  getThumbnail(arg: IFilesThumbnailArg): Promise<IFilesFileMetadata>;
  deleteFiles(
    files: string[]
  ): Promise<
    (IFilesFileMetadata | IFilesFolderMetadata | IFilesDeletedMetadata)[]
  >;
  private reduceListImageQuality(files);
  private uploadFilesToServer(files, path);
  private reduceImageQuality(file);
  private isJpegImage(mimetype);
  private isPngImage(mimetype);
  private reduceJpegImageQuality(file);
  private reducePngImageQuality(file);
  private resizeImage(resize, fileBinary);
}

export {
  IFileModel,
  IFilesListFolderResult,
  IFilesFileMetadata,
  IFilesThumbnailArg,
  IFilesDeleteArg,
  IFilesFolderMetadata,
  IFilesDeletedMetadata,
  TinyDropboxFilesController,
  TinyDropboxFilesService
};
