import type { IServiceCollection } from './interfaces';
import { ServiceCollection } from './ServiceCollection';
import type { ServiceCollectionOptions } from './types';
import { DefaultServiceCollectionOptions } from './types';

const mergeOptions = (options: Partial<ServiceCollectionOptions> | undefined): ServiceCollectionOptions => ({
  ...DefaultServiceCollectionOptions,
  ...options,
});

export const createServiceCollection = (options?: Partial<ServiceCollectionOptions>): IServiceCollection => new ServiceCollection(mergeOptions(options)) as IServiceCollection;
