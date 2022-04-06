import { S3Client } from '@aws-sdk/client-s3';
import s3Client from '../lib/s3Client';
import { IDbClient, IS3DbConnectParams } from '../types/DbClient';

export let client: S3Client;
export let dbInstance: IDbClient;

class DbClient implements IDbClient {
  client: S3Client;

  constructor(client: S3Client) {
    this.client = client;
  }

  save() {
  }
}

export function connect({ s3Config }: IS3DbConnectParams) {
  client = s3Client(s3Config);
  dbInstance = new DbClient(client);
  return client;
}
