import { S3ClientConfig } from "@aws-sdk/client-s3";

export type DbClientParams = {
  awsAccessKey: string;
  awsSecretKey: string;
  awsRegion: string;
  dbBucket: string;
};

export type IDbClient = {
  save: Function;
};

export type IS3DbConnectParams = {
  s3Config?: DbClientParams & S3ClientConfig;
};
