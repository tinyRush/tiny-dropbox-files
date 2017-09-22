import { Request, Response } from 'express';
import { TinyDropboxFilesService } from './TinyDropboxFilesService';
import {  } from '../index';

class TinyDropboxFilesController {
  private _filesService: TinyDropboxFilesService;
  private _rootFolder: string;
  constructor(options: { accessToken: string; rootFolder: string }) {
    this._filesService = new TinyDropboxFilesService(options.accessToken);
    this._rootFolder = options.rootFolder;
  }
  doFind(req: Request, res: Response) {
    let path = req.query.path ? req.query.path : this._rootFolder;
    this._filesService
      .getFilesList(path)
      .then(files => this.sendSuccess(res, files))
      .catch(response => this.sendFailure(res, response));
  }
  doGet(req: Request, res: Response) {
    let path = decodeURIComponent(req.originalUrl.split('?')[0]);
    this._filesService
      .downloadFile(
        {
          width: req.query.width || undefined,
          height: req.query.height || undefined
        },
        path
      )
      .then(fileBinary => {
        res.write(fileBinary, 'binary');
        res.end();
      })
      .catch(response => this.sendFailure(res, response));
  }
  doPost(req: Request, res: Response) {
    let path = req.headers.path
      ? `${this._rootFolder}${req.headers.path}`
      : this._rootFolder;
    this._filesService
      .uploadFiles(path, <Express.Multer.File[]>req.files)
      .then(files => this.sendSuccess(res, files))
      .catch(response => this.sendFailure(res, response));
  }
  doPut() {}
  doDelete(req: Request, res: Response) {
    this._filesService
      .deleteFiles(req.body.files)
      .then(files => this.sendSuccess(res, files))
      .catch(response => this.sendFailure(res, response));
  }
  private sendSuccess(res: Response, data: any) {
    res.status(200).send(data);
  }
  private sendFailure(res: Response, response: any) {
    let message = response.error
      ? response.error.error_summary
      : response.message;
    let status = response.status || 500;
    res.status(status).send(message);
  }
}

export { TinyDropboxFilesController };
