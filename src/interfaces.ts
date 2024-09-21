import type { SourceType, ServiceBuilder, ServiceDescriptor, ServiceIdentifier, ServiceModuleType, ServiceCollectionOptions } from './types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { MultipleRegistrationError } from './errors';

export abstract class IDisposable {
  public abstract [Symbol.dispose]: () => void;
}

export abstract class IServiceModule {
  public abstract registerServices(services: IServiceCollection): void;
}

export abstract class IServiceScope {
  /**
   * Resolves a single implementation for the identifier.
   * When finding multiple implementations, it will either
   * throw a {@link MultipleRegistrationError} or resolve the latest depending on the provided options.
   */
  public abstract resolve<T extends SourceType>(identifier: ServiceIdentifier<T>): T;
  /**
   * Resolves all implementations for the identifier.
   */
  public abstract resolveAll<T extends SourceType>(identifier: ServiceIdentifier<T>): T[];
}

export abstract class IServiceProvider extends IServiceScope {
  public abstract get Services(): IServiceCollection;
  public abstract createScope(): IServiceProvider & IDisposable;
}

export abstract class IServiceCollection {
  public abstract readonly options: ServiceCollectionOptions;
  public abstract get<T extends SourceType>(key: ServiceIdentifier<T>): ServiceDescriptor<T>[];
  public abstract register<T extends SourceType>(identifier: ServiceIdentifier<T>): ServiceBuilder<T>;
  public abstract registerModules(modules: ServiceModuleType[]): void;
  public abstract buildProvider(): IServiceProvider;
  public abstract clone(): IServiceCollection;
}
