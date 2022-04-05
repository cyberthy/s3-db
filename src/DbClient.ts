import { S3Client } from '@aws-sdk/client-s3';
import { env } from './lib/helpers';
import s3Client from './lib/s3Client';
import { ICollection } from './types';
import { DbClientParams } from './types/DbClient';

export class DbClient {
  client: S3Client;
  collections: ICollection[];

  constructor(params: DbClientParams) {
    this.checkParams(params);
    this.client = s3Client(params);
  }

  checkParams(params?: DbClientParams) {
    const { awsAccessKey, awsSecretKey } = params || {};
    if (!awsAccessKey && !env('AWS_ACCESS_KEY')) {
      throw new Error('No Access Key!');
    }

    if (!awsSecretKey && !env('AWS_SECRET_KEY')) {
      throw new Error('No Secret Key!');
    }
  }
}
