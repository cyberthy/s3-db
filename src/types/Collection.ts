export interface ICollection {
  id?: string;
  save: () => void,
  delete: () => void,
  list: () => void,
  getFile: (fileFieldName: string) => void
}

export type IFieldOptions = {};
