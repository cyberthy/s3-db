import { v4 as generateUUIDv4 } from "uuid";
import {
  FieldMap,
  FieldTypeRelationship,
  FieldTypes,
  ICollection,
} from "./types";
import { DbClient } from "./DbClient";
import { Field } from "./decorators";
import s3Client from "./lib/s3Client";
import { genEnvConfig } from "./lib/helpers";

export class Collection implements ICollection {
  protected client: DbClient;
  protected collectionPath: string;
  protected fieldMap: FieldMap;
  protected collectionName: string;

  private mockMode: boolean | undefined;
  private _loadRelationships: boolean;

  @Field({ type: FieldTypes.ID })
  id: string | undefined;

  constructor(initObj?: any, mockMode?: boolean) {
    this.setCollectionName();
    this.client = this.setConnection();

    this.set(initObj as any);

    this.mockMode = mockMode;
  }

  private setConnection() {
    const config = genEnvConfig();
    return new DbClient(s3Client(config), config.dbBucket);
  }

  private validateModel() {
    // should implement joi validation that is dynamic
  }

  private setCollectionName() {
    let name = Object.getPrototypeOf(this).constructor.name;
    name = name.replace(/[\W_]+/g, " ").toLowerCase();
    this.collectionName = name;
  }

  toJSON() {
    const jsonObj = {};
    for (const key of Object.keys(this.fieldMap)) {
      (jsonObj as any)[key] = (this as any)[key];
    }
    return jsonObj;
  }

  set(data: any) {
    if (data) {
      // validation here?
      for (const key of Object.keys(data)) {
        (this as any)[key] = (data as any)[key];
      }
    }
    return this;
  }

  get(key: string) {
    return (this as any)[key];
  }

  generateNewId() {
    this.set({ id: generateUUIDv4() });
  }

  async list() {
    const items = await this.client.list(
      `${this.collectionPath || ""}${this.collectionName || ""}`
    );

    if (!items) {
      return [];
    }

    const collectionPromises = [];
    for (const item of items) {
      collectionPromises.push(this.find(item.id));
    }
    return await Promise.all(collectionPromises);
  }

  async find(id?: string) {
    const result = await this.client.find(
      `${this.collectionPath || ""}${this.collectionName || ""}`,
      id || (this as any)["id"]
    );

    if (!result) {
      return {};
    }

    this.set(result);
    if (this._loadRelationships) {
      await this._eagerLoadRelationships();
    }

    return result;
  }

  hasTypeOfFields(type: FieldTypes): string[] {
    return Object.keys(this.fieldMap).filter(
      (item) => this.fieldMap[item].type === type
    );
  }

  async update() {
    this.commit();
  }

  async save() {
    this.generateNewId();
    this.commit();
  }

  // action methods
  async commit() {
    try {
      for (const key of this.hasTypeOfFields(FieldTypes.Relationship)) {
        const newRelationshipIds = await this._saveRelationship(
          this.get(key),
          this.fieldMap[key].relationshipType
        );
        this.set({ [key]: newRelationshipIds });
      }

      if (!this.mockMode) {
        for (const key of this.hasTypeOfFields(FieldTypes.File)) {
          const newPath = await this.client.saveRaw(
            `${this.collectionPath || ""}${this.collectionName || ""}`,
            this.get(key)
          );

          this.get(key).path = newPath;
          this.get(key).metadata.data = {};
        }

        await this.client.save(
          `${this.collectionPath || ""}${this.collectionName || ""}`,
          this.toJSON()
        );
      }
    } catch (error) {
      console.trace(error);
    }
  }

  private async _saveRelationship(
    rel: Collection | Collection[],
    relationshipType?: FieldTypeRelationship
  ) {
    switch (relationshipType) {
      case FieldTypeRelationship.OneToMany:
        const newIds = [];
        if ((rel as any)?.length) {
          for (const relationship of rel as any) {
            await relationship.save();
            newIds.push(relationship.get("id"));
          }
        }
        return newIds;

      default:
        return [];
    }
  }

  async delete() {
    if (!this.mockMode) {
      for (const key of this.hasTypeOfFields(FieldTypes.File)) {
        await this.client.deleteRaw((this as any)[key]);
      }

      await this.client.delete(
        `${this.collectionPath || ""}${this.collectionName || ""}`,
        (this as any).id
      );
    }
  }

  /**
   * A chain function to set the with relationships option
   * @returns Collection<T>
   */
  withRelationships(): Collection {
    this._loadRelationships = true;
    return this;
  }

  private async _eagerLoadRelationships() {
    for (const key of this.hasTypeOfFields(FieldTypes.Relationship)) {
      switch (this.fieldMap[key].relationshipType) {
        case FieldTypeRelationship.OneToMany:
          const fetchedRelationshipArr = [];
          for (const id of this.get(key)) {
            const relationshipClass = new this.fieldMap[key].relationshipClass({
              id,
            });
            await relationshipClass.find();
            fetchedRelationshipArr.push(relationshipClass);
          }

          this.set({ [key]: fetchedRelationshipArr });
          break;
        default:
          return [];
      }
    }
  }
}
