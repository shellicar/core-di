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

/**
 * declares a dependency, use on a class field
 * @param identifier the identifier to depend on, i.e. the interface
 */
export const dependsOn = <T extends SourceType>(identifier: ServiceIdentifier<T>) => {
  return (value: undefined, ctx: ClassFieldDecoratorContext) => {
    return function (this: object, initialValue: any) {
      const target = this.constructor;
      tagProperty(DesignDependenciesKey, target, ctx.name, identifier);
      return initialValue;
    };
  };
};
