import { S3ClientConfig } from '@aws-sdk/client-s3';

export type DbClientParams = {
  awsAccessKey: string;
  awsSecretKey: string;
  awsRegion: string;
  dbBucket: string;
};

export type IDbClient = {
  save: (collectionPath: string, data: any) => Promise<any>;
  delete: (collectionPath: string, collectionId: string) => Promise<any>;
  find: (collectionPath: string, collectionId: string) => Promise<any>;
};

export type IS3DbConnectParams = {
  s3Config?: DbClientParams & S3ClientConfig;
};
