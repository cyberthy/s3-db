import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { DbClientParams } from '../types/DbClient';
export default (parameters: DbClientParams & S3ClientConfig) =>
  new S3Client(parameters);
