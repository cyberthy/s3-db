import { dbInstance } from './DbClient';
import { IDbClient } from '../types';

export class Collection<T> {
  private _fields: T;
  private _client: IDbClient;

  constructor(initObj?: T) {
    this.getInstance();

    if (initObj) {
      Object.keys(initObj).forEach((key: string) => {
        (this as any)[key] = (initObj as any)[key];
      });
    }
  }

  getInstance() {
    this._client = dbInstance;
    return this._client;
  }

  getFields() {
    console.log(this._fields);
    return this._fields;
  }

  save() {
    this._client.save();
  }
}
