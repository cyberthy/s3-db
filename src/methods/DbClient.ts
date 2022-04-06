import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { IDbClient } from '../types/DbClient';
import { globalConfig } from './connect';

/**
 * Not going to be exported for now.
 */
export class DbClient<T> implements IDbClient {
  client: S3Client;

  constructor(client: S3Client) {
    this.client = client;
  }

  private generatePath(initialPath: string) {
    return '';
  }

  async save(collectionPath: string, data: T): Promise<boolean> {
    const path = this.generatePath(collectionPath);

    await this.client.send(
      new PutObjectCommand({
        Bucket: globalConfig.dbBucket,
        Key: path,
        Body: data as unknown as string,
      })
    );

    return true;
  }
}
