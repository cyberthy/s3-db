import { v4 as generateUUIDv4 } from "uuid";
import { baseModel, FieldMap, FieldTypes, ICollection } from "./types";
import { dbInstance } from "./connect";
import { DbClient } from "./DbClient";

export class Collection<T> implements ICollection {
  protected client: DbClient;
  protected model: baseModel & T;
  protected collectionPath: string;
  protected fieldMap: FieldMap;
  protected collectionName: string;

  private mockMode: boolean | undefined;

  constructor(initObj?: T, mockMode?: boolean) {
    this.setCollectionName();
    this.getInstance();

    if (initObj) {
      this.model = initObj as baseModel & T;
    }

    this.mockMode = mockMode;
  }

  private validateModel() {
    // should implement joi validation that is dynamic
  }

  /**
   * get a snapshot of the instance model at a specific time.
   */
  get _snapshot() {
    return this.model;
  }

  private setCollectionName() {
    let name = Object.getPrototypeOf(this).constructor.name;
    name = name.replace(/[\W_]+/g, " ").toLowerCase();
    this.collectionName = name;
  }

  private getInstance() {
    this.client = dbInstance;
  }

  toJSON() {
    return this.model;
  }

  set(data: T) {
    console.log(this.fieldMap);
    // validation here?
    if (data) {
      this.model = {
        ...this.model,
        ...data,
      };
    }
  }

  generateNewId() {
    this.set({ id: generateUUIDv4() } as any);
  }

  async list() {
    const items = await this.client.list(
      `${this.collectionPath || ""}${this.collectionName || ""}`
    );

    if (!items) {
      return [];
    }

    let collections = [];
    for (const item of items) {
      const fetched = await this.find(item.id);
      collections.push(fetched);
    }

    return collections;
  }

  async find(id?: string) {
    const result = await this.client.find(
      `${this.collectionPath || ""}${this.collectionName || ""}`,
      id || this.model.id
    );

    if (!result) {
      return {};
    }

    this.set(result);
    return result;
  }

  hasFileFields(): string[] {
    return Object.keys(this.fieldMap).filter(
      (item) => this.fieldMap[item].type === FieldTypes.File
    );
  }

  // action methods
  async save() {
    if (!this.model.id) {
      this.generateNewId();
    }

    for (const key of this.hasFileFields()) {
      const newPath = await this.client.saveRaw(
        `${this.collectionPath || ""}${this.collectionName || ""}`,
        (this.model as any)[key]
      );

      (this.model as any)[key].path = newPath;
      (this.model as any)[key].metadata.data = {};
    }

    if (!this.mockMode) {
      await this.client.save(
        `${this.collectionPath || ""}${this.collectionName || ""}`,
        this.toJSON()
      );
    }
  }

  async delete() {
    if (!this.mockMode) {
      for (const key of this.hasFileFields()) {
        await this.client.deleteRaw((this.model as any)[key]);
      }

      await this.client.delete(
        `${this.collectionPath || ""}${this.collectionName || ""}`,
        this.model.id
      );
    }
  }
}
