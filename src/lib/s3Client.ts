import { S3Client } from '@aws-sdk/client-s3';
import { DbClientParams } from '../types';
export default (parameters: DbClientParams) => {
  return new S3Client({
    region: parameters.region,
    credentials:  {
      accessKeyId: parameters.awsAccessKey,
      secretAccessKey: parameters.awsSecretKey
    } as any
  });
};
