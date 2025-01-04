import type { Lifetime } from './enums';
import type { MultipleRegistrationError } from './errors';
import type { EnsureObject, ServiceBuilder, ServiceCollectionOptions, ServiceDescriptor, ServiceIdentifier, ServiceModuleType, SourceType, UnionToIntersection } from './types';

export abstract class IDisposable {
  public abstract [Symbol.dispose](): void;
}

export abstract class IServiceModule {
  /**
   * Registers services to the provided collection.
   * @param services
   */
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
  /**
   * Gets the services collection that was used to create this provider.
   */
  public abstract get Services(): IServiceCollection;
  /**
   * Creates a new scope.
   */
  public abstract createScope(): IServiceProvider & IDisposable;
}

export abstract class IServiceCollection {
  /**
   * Overrides the lifetime for all the bindings of the given identifier.
   * @param identifier
   * @param lifetime
   */
  public abstract overrideLifetime<T extends SourceType>(identifier: ServiceIdentifier<T>, lifetime: Lifetime): void;
  /**
   * The options that were provided for the service collection.
   */
  public abstract readonly options: ServiceCollectionOptions;
  /**
   * Gets all the descriptors for the given identifier.
   * @param identifier
   */
  public abstract get<T extends SourceType>(identifier: ServiceIdentifier<T>): ServiceDescriptor<T>[];
  /**
   * Starts the registration process for the given service identifiers.
   * @param identifiers
   * @returns a builder than can be used to define the implementation and lifetime.
   */
  public abstract register<Types extends SourceType[]>(...identifiers: { [K in keyof Types]: ServiceIdentifier<Types[K]> }): ServiceBuilder<EnsureObject<UnionToIntersection<Types[number]>>>;
  /**
   * Registers the services from the provided modules.
   * @param modules
   */
  public abstract registerModules(...modules: ServiceModuleType[]): void;
  /**
   * Builds a service provider. This takes a snapshot of the current configuration.
   * Further changes to the service collection will not be reflected in the provider.
   */
  public abstract buildProvider(): IServiceProvider;
  /**
   * Clones the current service collection.
   */
  public abstract clone(): IServiceCollection;
  /**
   * Clones the service collection for a scoped provider.
   * @param scoped
   */
  public abstract clone(scoped: true): IServiceCollection;
}
