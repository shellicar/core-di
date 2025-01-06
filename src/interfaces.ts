import type { Lifetime } from './enums';
import { ResolveMultipleMode } from './enums';
import type { EnsureObject, IServiceBuilder, ServiceCollectionOptions, ServiceDescriptor, ServiceIdentifier, ServiceModuleType, SourceType, UnionToIntersection } from './types';

export abstract class IDisposable {
  public abstract [Symbol.dispose](): void;
}

export abstract class IServiceModule {
  public abstract registerServices(services: IServiceCollection): void;
}

export abstract class IResolutionScope {
  /**
   * Resolves a single implementation for the given identifier.
   * @template T The type of service to resolve
   * @param identifier The service identifier
   * @returns The resolved instance
   * @throws {MultipleRegistrationError} When multiple implementations exist (unless {@link ServiceCollectionOptions.registrationMode} is set to {@link ResolveMultipleMode.LastRegistered}).
   * @throws {UnregisteredServiceError} When no implementation exists
   */
  public abstract resolve<T extends SourceType>(identifier: ServiceIdentifier<T>): T;

  /**
   * Resolves all implementations for the given identifier.
   * @template T The type of service to resolve
   * @param identifier The service identifier
   * @returns Array of resolved instances
   */
  public abstract resolveAll<T extends SourceType>(identifier: ServiceIdentifier<T>): T[];
}

export abstract class IScopedProvider extends IResolutionScope implements IDisposable {
  public abstract [Symbol.dispose](): void;
}

export abstract class IServiceProvider extends IResolutionScope {
  public abstract readonly Services: IServiceCollection;
  public abstract createScope(): IScopedProvider;
}

export abstract class IServiceCollection {
  public abstract readonly options: ServiceCollectionOptions;
  public abstract get<T extends SourceType>(identifier: ServiceIdentifier<T>): ServiceDescriptor<T>[];
  public abstract register<Types extends SourceType[]>(...identifiers: { [K in keyof Types]: ServiceIdentifier<Types[K]> }): IServiceBuilder<EnsureObject<UnionToIntersection<Types[number]>>>;
  public abstract registerModules(...modules: ServiceModuleType[]): void;
  public abstract overrideLifetime<T extends SourceType>(identifier: ServiceIdentifier<T>, lifetime: Lifetime): void;
  public abstract buildProvider(): IServiceProvider;
  public abstract clone(): IServiceCollection;
  public abstract clone(scoped: true): IServiceCollection;
}
