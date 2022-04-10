export interface ICollection {
  save: () => void;
  delete: () => void;
  list: () => void;
}

export type baseModel = { id: string };
export enum FieldTypes {
  File = 'file',
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Object = 'object',
}

export type FieldMap = { [name: string]: { type: FieldTypes } };

export interface IFileCollection {
  getFile: (fileFieldName: string) => void;
}

export type IFieldOptions = {};

export interface IColumn {
  name: string;
  type: 'number' | 'text';
}
