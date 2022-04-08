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
    return `${initialPath}/${objectId}`;
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

  private streamToString(stream: any) {
    return new Promise((resolve, reject) => {
      const chunks: any = [];
      stream.on('data', (chunk: any) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }

  async find(collectionPath: string, collectionId: string) {
    try {
      const path = this.validatePath(collectionPath, collectionId);
      const { Body } = await this.client.send(
        new GetObjectCommand({
          Bucket: globalConfig.dbBucket,
          Key: path,
          ResponseContentType: 'Buffer',
        })
      );

      const value: string = (await this.streamToString(Body)) as string;
      return JSON.parse(value);
    } catch (error) {
      console.log(error);
      throw 'Item not found';
    }
  }

  async save(collectionPath: string, data: any): Promise<boolean> {
    const path = this.validatePath(collectionPath, data.id);
    await this.client.send(
      new PutObjectCommand({
        Bucket: globalConfig.dbBucket,
        Key: path,
        Body: JSON.stringify(data) as unknown as string,
      })
    );

    return true;
  }

  async delete(collectionPath: string, collectionId: string) {
    const path = this.validatePath(collectionPath, collectionId);
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: globalConfig.dbBucket,
        Key: path,
      })
    );

    return true;
  }
}
