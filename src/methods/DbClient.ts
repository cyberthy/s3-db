import { S3Client } from '@aws-sdk/client-s3';
import { genEnvConfig } from '../lib/helpers';
import s3Client from '../lib/s3Client';
import {
  IDbClient,
  IS3DbConnectParams
} from '../types/DbClient';

export let client: S3Client;
export let dbInstance: IDbClient;

class DbClient implements IDbClient {
  client: S3Client;

  constructor(client: S3Client) {
    this.client = client;
  }

  save() {}
}


export function connect({ s3Config }: IS3DbConnectParams) {
  let config;
  if (!s3Config) {
    config = genEnvConfig();
  } else {
    config = s3Config;
  }

  client = s3Client(config);
  dbInstance = new DbClient(client);
  return client;
}
