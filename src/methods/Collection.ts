import { ICollection, IDbClient } from "../types";
import { dbInstance } from "./connect";
import { v4 as generateUUIDv4 } from "uuid";

type fieldType = { id: string };
export class Collection<T> implements ICollection {
  private _fields: string[];
  private _values: fieldType & T = {} as fieldType & T;
  private _files: any;
  private _client: IDbClient;
  protected _collectionName: string;

  // Todo: this will need validation
  protected collectionPath: string;
  mockMode: boolean | undefined;

  constructor(initObj?: T, mockMode?: boolean) {
    this.getInstance();
    this.setCollectionName();
    this.mockMode = mockMode;

    if (initObj) {
      this.set(initObj);
    }
  }

  private setCollectionName() {
    let name = Object.getPrototypeOf(this).constructor.name;
    name = name.replace(/[\W_]+/g, " ").toLowerCase();
    this._collectionName = name;
  }

  get get() {
    return this._values;
  }

  private getInstance() {
    this._client = dbInstance;
    return this._client;
  }

  protected getFields() {
    return this._values;
  }

  public toJSON() {
    return this._values;
  }

  public set(data: T) {
    if (data) {
      Object.keys(data).forEach((key: any) => {
        if (key === "id" || this._fields.includes(key)) {
          (this._values as any)[key] = (data as any)[key];
        }
      });
    }
  }

  generateNewId() {
    this.set({ id: generateUUIDv4() } as any);
  }

  async getFile(fileFieldName: string) {
    if (!this._fields.includes(fileFieldName)) {
      throw `this field doesn't exist`;
    }

    return await this._client.getRawFile((this._values as any)[fileFieldName]);
  }

  async list() {
    return await this._client.list(
      `${this.collectionPath || ""}${this._collectionName || ""}`
    );
  }

  async find() {
    const result = await this._client.find(
      `${this.collectionPath || ""}${this._collectionName || ""}`,
      this._values.id
    );

    if (!result) {
      return {};
    }

    this.set(result);
    return result;
  }

  // action methods
  async save() {
    if (!this._values.id) {
      this.generateNewId();
    }

    if (this._files) {
      for (const key of Object.keys(this._files)) {
        const newPath = await this._client.saveRaw(
          `${this.collectionPath || ""}${this._collectionName || ""}`,
          (this._values as any)[key]
        );

        (this._values as any)[key].path = newPath;
        (this._values as any)[key].metadata.data = {};
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
      if (this._files) {
        for (const key of Object.keys(this._files)) {
          await this._client.deleteRaw((this._values as any)[key]);
        }
      }

      await this._client.delete(
        `${this.collectionPath || ""}${this._collectionName || ""}`,
        this._values.id
      );
    }
  }
}
