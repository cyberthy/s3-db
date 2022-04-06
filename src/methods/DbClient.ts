import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { IDbClient } from '../types';
import { globalConfig } from './connect';

/**
 * Not going to be exported for now.
 */
export class DbClient implements IDbClient {
  client: S3Client;

  constructor(client: S3Client) {
    this.client = client;
  }

  private validatePath(initialPath: string, objectId: string) {
    return `${initialPath}/${objectId}.json`;
  }

  async find(collectionPath: string, collectionId: string) {
    const path = this.validatePath(collectionPath, collectionId);

    console.log(globalConfig, path);
    await this.client.send(
      new GetObjectCommand({
        Bucket: globalConfig.dbBucket,
        Key: path,
      })
    );

    return true;
  }

  async save(collectionPath: string, data: any): Promise<boolean> {
    const path = this.validatePath(collectionPath, data.id);
    console.log(globalConfig, path);
    await this.client.send(
      new PutObjectCommand({
        Bucket: globalConfig.dbBucket,
        Key: path,
        Body: data as unknown as string,
      })
    );

    return true;
  }

  async delete(collectionPath: string, collectionId: string) {
    const path = this.validatePath(collectionPath, collectionId);
    console.log(path);
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: globalConfig.dbBucket,
        Key: path,
      })
    );

    return true;
  }
}
