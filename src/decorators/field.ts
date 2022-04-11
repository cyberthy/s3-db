import { FieldMap, FieldMapType, FieldTypes } from "../types";

export function Field(options?: FieldMapType) {
  return function (target: any, name: string) {
    let val: any;

    if (!target.fieldMap) {
      target.fieldMap = {};
    }

    target.fieldMap[name] = {
      name,
      type: options?.type || FieldTypes.String,
      relationshipType: options?.relationshipType || "",
      relationshipClass: options?.relationshipClass || undefined,
    };

    const get = () => {
      return val;
    };

    const set = (value: any) => {
      val = value;
    };

    Object.defineProperty(target, name, {
      set,
      get,
      configurable: true,
      enumerable: true,
    });
  };
}
