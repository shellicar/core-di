import { ServiceCollection } from './private/ServiceCollection';
import { ConsoleLogger } from './private/consoleLogger';
import type { IServiceCollection } from './interfaces';
import type { ServiceCollectionOptions } from './types';
import { DefaultServiceCollectionOptions } from './defaults';

const mergeOptions = (options: Partial<ServiceCollectionOptions> | undefined): ServiceCollectionOptions => ({
  ...DefaultServiceCollectionOptions,
  ...options,
});

/**
 * Creates a service collection with the (optionally) provided options
 * @param options - Optional configuration for the service collection.
 * @defaultValue Default options are taken from {@link DefaultServiceCollectionOptions}.
 */
export const createServiceCollection = (options?: Partial<ServiceCollectionOptions>): IServiceCollection => {
  const mergedOptions = mergeOptions(options);
  const logger = mergedOptions.logger ?? new ConsoleLogger(mergedOptions);
  return new ServiceCollection(logger, mergedOptions, false);
};
