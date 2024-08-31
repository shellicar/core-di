import { DesignDependenciesKey } from './constants';
import type { ServiceIdentifier, SourceType } from './types';
import { defineMetadata, getMetadata } from './metadata';

const tagProperty = <T extends SourceType>(metadataKey: string, annotationTarget: object, name: string | symbol, identifier: ServiceIdentifier<T>) => {
  let existing = getMetadata<T>(metadataKey, annotationTarget);
  if (existing === undefined) {
    existing = {};
    defineMetadata(metadataKey, existing, annotationTarget);
  }
  existing[name] = identifier;
};

export const dependsOn = <T extends SourceType>(identifier: ServiceIdentifier<T>) => {
  return (value: undefined, ctx: ClassFieldDecoratorContext) => {
    return function (this: object, initialValue: any) {
      if (Reflect.getMetadata === undefined) {
        throw new Error('Please import reflect-metadata');
      }

      const target = this.constructor;
      tagProperty(DesignDependenciesKey, target, ctx.name, identifier);
      return initialValue;
    };
  };
};
