import { IFieldOptions } from '../types';

export function field(options?: IFieldOptions) {
  return function (target: any, key: string) {
    if (!target._fields) {
      target._fields = [];
    }

    target._fields.push(key);
  };
}
