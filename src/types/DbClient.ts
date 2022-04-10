import { S3ClientConfig } from "@aws-sdk/client-s3";
import { IFile } from "../decorators";

export type DbClientParams = {
  awsAccessKey: string;
  awsSecretKey: string;
  region: string;
  dbBucket: string;
};

export type IDbClient = {
  save: (collectionPath: string, data: any) => Promise<any>;
  delete: (collectionPath: string, collectionId: string) => Promise<any>;
  find: (collectionPath: string, collectionId: string) => Promise<any>;
  list: (collectionPath: string) => Promise<any>;
  saveRaw: (collectionPath: string, file: IFile) => Promise<any>;
  getRawFile: (file: IFile) => Promise<any>;
  deleteRaw: (file: IFile) => Promise<any>;
};

export type IS3DbConnectParams = {
  s3Config?: DbClientParams;
};
