import 'reflect-metadata';
import type { MetadataType, SourceType } from './types';

export const getMetadata = <T extends SourceType>(key: string, obj: object): MetadataType<T> | undefined => {
  const result = Reflect.getMetadata(key, obj);
  if (result === undefined) {
    return undefined;
  }
  return result as MetadataType<T>;
};

export const defineMetadata = <T extends SourceType>(key: string, metadata: MetadataType<T>, obj: object) => {
  Reflect.defineMetadata(key, metadata, obj);
};
