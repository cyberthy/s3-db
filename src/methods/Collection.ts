import { dbInstance } from './DbClient';
import { IDbClient } from '../types';

export class Collection {
  private _fields: string[];
  private _client: IDbClient;

  constructor() {
    this.getInstance();
  }

  getInstance() {
    this._client = dbInstance;
    return this._client;
  }

  getFields() {
    return this._fields;
  }

  save() {
    this._client.save();
  }
}
