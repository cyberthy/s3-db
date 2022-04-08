import { IFieldOptions } from '../types';

export function field(options?: IFieldOptions) {
  return function (target: any, key: string) {
    let val: any;
    
    if (!target._fields) {
      target._fields = {};
    }

    target._fields[key] = null;

    const getter = () => {
      return val;
    };

    const setter = (value: any) => {
      target._fields[key] = value;
      val = value;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}