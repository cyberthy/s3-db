export interface ICollection {
  save: () => void;
  delete: () => void;
  list: () => void;
  getFile: (fileFieldName: string) => void;
}

export type IFieldOptions = {};
