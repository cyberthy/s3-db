import { ICollection, IDbClient } from '../types';
import { dbInstance } from './connect';
import * as crypto from 'crypto';

export class Collection<T> implements ICollection {
  private _fields: { id: string } & T;
  private _client: IDbClient;
  protected _collectionName: string;

  // Todo: this will need validation
  protected collectionPath: string;
  mockMode: boolean | undefined;

  constructor(initObj?: T, mockMode?: boolean) {
    this.getInstance();

    if (initObj) {
      Object.keys(initObj).forEach((key: string) => {
        (this as any)[key] = (initObj as any)[key];
        (this._fields as any)[key] = (initObj as any)[key];
      });
    }

    this.validateCollection();
    this.setCollectionName();
    // this.checkCollectionFolderExists();

    this.mockMode = mockMode;
  }

  private setCollectionName() {
    let name = Object.getPrototypeOf(this).constructor.name;
    name = name.replace(/[\W_]+/g, ' ').toLowerCase();
    this._collectionName = name;
  }

  private validateCollection() {
    // this method needs to validate the collection setup
  }

  // private checkCollectionFolderExists() {
    // const exists = await this._client.
  // }

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

  generateNewId() {
    this._fields.id = crypto.randomUUID();
  }

  async list() {
    return await this._client.list(
      `${this.collectionPath || ''}${this._collectionName || ''}`
    );
  }

  async find() {
    return await this._client.find(
      `${this.collectionPath || ''}${this._collectionName || ''}`,
      this._fields.id
    );
  }

  // action methods
  async save() {
    if (!this._fields.id) {
      this.generateNewId();
    }

    if (!this.mockMode) {
      await this._client.save(
        `${this.collectionPath || ''}${this._collectionName || ''}`,
        this.toJSON()
      );
    }
  }

  public delete() {
    if (!this.mockMode) {
      this._client.delete(
        `${this.collectionPath || ''}${this._collectionName || ''}`,
        this._fields.id
      );
    }
  }
}
