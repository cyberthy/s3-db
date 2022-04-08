import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
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

  /**
   * List method will grab all objects with a specific prefix
   * filter the prefix item and set an id property on the objects returned
   * @param collectionPath
   * @returns
   */
  async list(collectionPath: string) {
    const Prefix = `${collectionPath}/`;

    const objects = await this.client.send(
      new ListObjectsV2Command({
        Bucket: globalConfig.dbBucket,
        Delimiter: '/',
        Prefix,
      })
    );

    const objectsNotFolders = objects.Contents?.filter(
      (object) => object.Key !== Prefix
    );

    return objectsNotFolders?.map((object) => ({
      id: object.Key?.split('/')[1],
      ...object,
    }));
  }

  async find(collectionPath: string, collectionId: string) {
    const path = this.validatePath(collectionPath, collectionId);
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
