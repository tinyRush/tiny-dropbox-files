import {
  IFileModel,
  IFilesListFolderResult,
  IFilesFileMetadata,
  IFilesThumbnailArg,
  IFilesDeleteArg,
  IFilesFolderMetadata,
  IFilesDeletedMetadata
} from '../index';
import { IMAGE } from './constants';
import * as sharp from 'sharp';
const Dropbox = require('dropbox');

class TinyDropboxFilesService {
  private _dbx: IFileModel;
  constructor(accessToken: string) {
    this._dbx = new Dropbox({
      accessToken: accessToken
    });
  }
  getFilesList(path: string): Promise<IFilesListFolderResult> {
    return this._dbx.filesListFolder({ path: path });
  }
  uploadFiles(
    path: string,
    files: Express.Multer.File[]
  ): Promise<IFilesFileMetadata[]> {
    return this.reduceListImageQuality(files).then(compressedFiles =>
      this.uploadFilesToServer(compressedFiles, path)
    );
  }
  downloadFile(resize: any, path: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this._dbx
        .filesDownload({ path: path })
        .then(file => this.resizeImage(resize, file.fileBinary))
        .then(resolve)
        .catch(reject);
    });
  }
  getThumbnail(arg: IFilesThumbnailArg): Promise<IFilesFileMetadata> {
    return this._dbx.filesGetThumbnail(arg);
  }
  deleteFiles(
    files: string[]
  ): Promise<
    (IFilesFileMetadata | IFilesFolderMetadata | IFilesDeletedMetadata)[]
  > {
    return Promise.queue(files, file => this._dbx.filesDelete({ path: file }));
  }
  private reduceListImageQuality(
    files: Express.Multer.File[]
  ): Promise<Express.Multer.File[]> {
    return Promise.queue<
      Express.Multer.File,
      Express.Multer.File
    >(files, file => this.reduceImageQuality(file));
  }
  private uploadFilesToServer(
    files: Express.Multer.File[],
    path: string
  ): Promise<IFilesFileMetadata[]> {
    return Promise.queue<
      Express.Multer.File,
      IFilesFileMetadata
    >(files, file => {
      let filePath = `${path}/${file.originalname}`;
      return this._dbx.filesUpload({
        path: filePath,
        contents: file.buffer,
        autorename: true
      });
    });
  }
  private reduceImageQuality(
    file: Express.Multer.File
  ): Promise<Express.Multer.File> {
    if (this.isJpegImage(file.mimetype)) {
      return this.reduceJpegImageQuality(file);
    } else if (this.isPngImage(file.mimetype)) {
      return this.reducePngImageQuality(file);
    } else {
      return Promise.resolve(file);
    }
  }
  private isJpegImage(mimetype: string) {
    return mimetype === IMAGE.MIME_TYPE.JPEG;
  }
  private isPngImage(mimetype) {
    return mimetype === IMAGE.MIME_TYPE.PNG;
  }
  private reduceJpegImageQuality(
    file: Express.Multer.File
  ): Promise<Express.Multer.File> {
    return new Promise((resolve, reject) => {
      sharp(file.buffer)
        .jpeg({ quality: 70 })
        .toBuffer()
        .then(buffer => {
          file.buffer = buffer;
          resolve(file);
        })
        .catch(reject);
    });
  }
  private reducePngImageQuality(
    file: Express.Multer.File
  ): Promise<Express.Multer.File> {
    return new Promise((resolve, reject) => {
      sharp(file.buffer)
        .png({ compressionLevel: 5 })
        .toBuffer()
        .then(buffer => {
          file.buffer = buffer;
          resolve(file);
        })
        .catch(reject);
    });
  }
  private resizeImage(resize: any, fileBinary: string) {
    if (!resize && !resize.width && !resize.query)
      return Promise.resolve(fileBinary);
    return new Promise((resolve, reject) => {
      let fileBuffer = new Buffer(fileBinary, 'binary');
      let width = resize.width ? Number.parseInt(resize.width) : undefined;
      let height = resize.height ? Number.parseInt(resize.height) : undefined;
      sharp(fileBuffer)
        .resize(width, height)
        .toBuffer()
        .then(resolve)
        .catch(reject);
    });
  }
}

export { TinyDropboxFilesService };
