export interface ICollection {
  id?: string;
  save: () => void,
  delete: () => void,
  list: () => void
}

export type IFieldOptions = {};
