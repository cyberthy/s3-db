import { ICollection, IDbClient } from "../types";
import { dbInstance } from "./connect";
import * as crypto from "crypto";

export class Collection<T> implements ICollection {
  private _fields: { id: string } & T;
  private _files: any;
  private _client: IDbClient;
  protected _collectionName: string;

  // Todo: this will need validation
  protected collectionPath: string;
  mockMode: boolean | undefined;

  constructor(initObj?: T, mockMode?: boolean) {
    this.getInstance();
    this.set(initObj as any);
    this.setCollectionName();
    this.mockMode = mockMode;
  }

  private setCollectionName() {
    let name = Object.getPrototypeOf(this).constructor.name;
    name = name.replace(/[\W_]+/g, " ").toLowerCase();
    this._collectionName = name;
  }

  private getInstance() {
    this._client = dbInstance;
    return this._client;
  }

  protected getFields() {
    return this._fields;
  }

  public toJSON() {
    return this._fields;
  }

  public set(data: T) {
    if (data) {
      Object.keys(data).forEach((key: any) => {
        if (key === "id" || (this._fields as any).hasOwnProperty(key)) {
          (this as any)[key] = (data as any)[key];
          (this._fields as any)[key] = (data as any)[key];
        }
      });
    }
  }

  generateNewId() {
    this._fields.id = crypto.randomUUID();
  }

  async getFile(fileFieldName: string) {
    if (!this._fields.hasOwnProperty(fileFieldName)) {
      throw `this field doesn't exist`;
    }
    console.log((this._fields as any)[fileFieldName]);
    return await this._client.getRawFile(
      (this._fields as any)[fileFieldName].path
    );
  }

  async list() {
    return await this._client.list(
      `${this.collectionPath || ""}${this._collectionName || ""}`
    );
  }

  async find() {
    const result = await this._client.find(
      `${this.collectionPath || ""}${this._collectionName || ""}`,
      this._fields.id
    );

    if (!result) {
      return {};
    }

    this.set(result);
    return result;
  }

  // action methods
  async save() {
    if (!this._fields.id) {
      this.generateNewId();
    }

    if (this._files) {
      for (const key of Object.keys(this._files)) {
        const newPath = await this._client.saveRaw(
          `${this.collectionPath || ""}${this._collectionName || ""}`,
          (this._fields as any)[key]
        );

        (this._fields as any)[key].path = newPath;
        (this._fields as any)[key].metadata.data = {};
      }
    }

    if (!this.mockMode) {
      await this._client.save(
        `${this.collectionPath || ""}${this._collectionName || ""}`,
        this.toJSON()
      );
    }
  }

  async delete() {
    if (!this.mockMode) {
      await this._client.delete(
        `${this.collectionPath || ""}${this._collectionName || ""}`,
        this._fields.id
      );
    }
  }
}
