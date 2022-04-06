import { IDbClient } from '../types';
import { dbInstance } from './connect';

export class Collection<T> {
  private _fields: T;
  private _client: IDbClient;

  // Todo: this will need validation
  protected collectionPath: string;

  constructor(initObj?: T) {
    this.getInstance();

    if (initObj) {
      Object.keys(initObj).forEach((key: string) => {
        (this as any)[key] = (initObj as any)[key];
      });
    }

    this.validateCollection();
  }

  private validateCollection() {
    // this method needs to validate the collection setup
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

  public save() {
    this._client.save();
  }
}
