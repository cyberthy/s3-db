import { readFileSync } from "fs";

export type IFile = {
  src: string;
  path: string;
  metadata: IFileMetadata;
};

export type IFileMetadata = {
  name: string;
  size: number;
  data: Buffer;
  mimetype: string;
};

export type IFileFieldOptions = {};

export function File(options?: IFileFieldOptions) {
  return function (target: any, key: string) {
    let val: any;

    if (!target._fields) {
      target._fields = {};
    }

    if (!target._files) {
      target._files = {};
    }

    target._fields[key] = null;
    target._files[key] = null;

    const getter = () => {
      return val;
    };

    const setter = (value: IFile) => {
      const fileData = value.metadata.data;
      target._fields[key] = value.metadata.name;
      target._files[key] = fileData;
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
