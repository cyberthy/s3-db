import { IFieldOptions } from "../types";

export function Field(options?: IFieldOptions) {
  return function (target: any, key: string) {
    let val: any;

    if (!target._fields) {
      target._fields = [];
    }
    target._fields.push(key);

    const getter = () => {
      return val;
    };

    const setter = (value: any) => {
      target._values[key] = value;
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
