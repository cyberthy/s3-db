import { ICollection } from "./types";

export function id(value?: string) {
  return function (target: any, key: string) {
    if (!target._blueprint) {
      target._blueprint = {};
    }

    target._blueprint[key];
  };
}

export function field(value?: string) {
  return function (target: any, key: string) {
    if (!target._blueprint) {
      target._blueprint = {};
    }

    target._blueprint[key];
  };
}

type Constructor = { new (...args: any[]): any };

export function Collection(): any {
  return function <T extends Constructor & ICollection>(BaseClass: T) {
    return class extends BaseClass {
      save() {
        console.log('working');
      }
    };
  };
}
