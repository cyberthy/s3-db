import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { IDbClient } from "./types";
import { globalConfig } from "./connect";
import * as crypto from "crypto";
import { IFile } from "./types/File";

/**
 * Not going to be exported for now.
 */
export class DbClient implements IDbClient {
  client: S3Client;

  constructor(client: S3Client) {
    this.client = client;
  }

  /**
   * generates a valid path for s3
   * @param initialPath
   * @param objectId
   * @returns
   */
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
        Delimiter: "/",
        Prefix,
      })
    );

    const objectsNotFolders = objects.Contents?.filter(
      (object) => object.Key !== Prefix
    );

    return objectsNotFolders?.map((object) => ({
      id: { ...object }.Key?.split("/").pop(),
      ...object,
    }));
  }

  /**
   * converts an s3 result to a string
   * @param stream
   * @param encoding
   * @returns
   */
  private streamToString(stream: any, encoding?: any) {
    return new Promise((resolve, reject) => {
      const chunks: any = [];
      stream.on("data", (chunk: any) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () =>
        resolve(Buffer.concat(chunks).toString(encoding || "utf8"))
      );
    });
  }

  /**
   * goes and finds a document with from the collectionid and the collection path
   * @param collectionPath
   * @param collectionId
   * @returns
   */
  async find(collectionPath: string, collectionId: string) {
    try {
      const path = this.validatePath(collectionPath, collectionId);
      const { Body } = await this.client.send(
        new GetObjectCommand({
          Bucket: globalConfig.dbBucket,
          Key: path,
          ResponseContentType: "Buffer",
        })
      );

      const value: string = (await this.streamToString(Body)) as string;
      return JSON.parse(value);
    } catch (error) {
      throw "Item not found";
    }
  }

  /**
   * gets any raw files that are stored in the _file prefix
   * @param filePath
   * @returns
   */
  async getRawFile(file: IFile) {
    try {
      const { Body } = await this.client.send(
        new GetObjectCommand({
          Bucket: globalConfig.dbBucket,
          Key: file.path,
          ResponseContentType: "Buffer",
        })
      );

      const value: string = (await this.streamToString(
        Body,
        "base64"
      )) as string;
      return value;
    } catch (error) {
      throw "Item not found";
    }
  }

  /**
   * saves a collection
   * @param collectionPath
   * @param data
   * @returns
   */
  async save(collectionPath: string, data: any): Promise<any> {
    const path = this.validatePath(collectionPath, data.id);
    return await this.client.send(
      new PutObjectCommand({
        Bucket: globalConfig.dbBucket,
        Key: path,
        Body: JSON.stringify(data) as unknown as string,
      })
    );
  }

  /**
   * saves a raw file under the _files directory
   * @param collectionPath
   * @param file
   * @returns
   */
  async saveRaw(collectionPath: string, file: IFile): Promise<string> {
    const newName = `${crypto.randomUUID()}_${file.metadata.name}`;
    const path = `${collectionPath}/_files/${newName}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: globalConfig.dbBucket,
        Key: path,
        Body: file.metadata.data,
      })
    );
    return path;
  }

  /**
   * deletes a  a raw file under the _files directory
   * @param collectionPath
   * @param file
   * @returns
   */
  async deleteRaw(file: IFile): Promise<boolean> {
    if (!file.path) {
      return false;
    }

    const path = file.path;
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: globalConfig.dbBucket,
        Key: path,
      })
    );

    return true;
  }

  /**
   * deletes a collection
   * @param collectionPath
   * @param collectionId
   * @returns
   */
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
