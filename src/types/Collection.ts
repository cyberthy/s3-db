import { Collection } from "../Collection";

export interface ICollection {
  id: string | undefined;
  save: () => void;
  delete: () => Promise<void>;
  list: () => Promise<Collection[]>;
  bulkDelete: (items: Collection[]) => Promise<boolean>;
}

export type baseModel = { id: string };
export enum FieldTypes {
  File = "file",
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Object = "object",
  Relationship = "relationship",
  ID = "id",
}

export enum FieldTypeRelationship {
  OneToOne = "oneToOne",
  OneToMany = "oneToMany",
  ManyToMany = "manyToMany",
}

export type FieldMapType = {
  type: FieldTypes;
  collection?: any;
  relationshipType?: FieldTypeRelationship;
  relationshipClass?: any;
};

export type FieldMap = {
  [name: string]: FieldMapType;
};

export interface IFileCollection {
  getFile: (fileFieldName: string) => void;
}

export type IFieldOptions = {};

export interface IColumn {
  name: string;
  type: "number" | "text";
}
