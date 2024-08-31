import '@abraham/reflection';
import type { MetadataType, SourceType } from './types';

export const getMetadata = <T extends SourceType>(key: string, obj: object): MetadataType<T> | undefined => {
  if (Reflect.getMetadata === undefined) {
    throw new Error('Please import "reflect-metadata"');
  }
  const result = Reflect.getMetadata(key, obj);
  if (result === undefined) {
    return undefined;
  }
  return result as MetadataType<T>;
};

export const defineMetadata = <T extends SourceType>(key: string, metadata: MetadataType<T>, obj: object) => {
  if (Reflect.defineMetadata === undefined) {
    throw new Error('Please import "reflect-metadata"');
  }
  Reflect.defineMetadata(key, metadata, obj);
};
