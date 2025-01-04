import { ServiceProvider } from './ServiceProvider';
import { Lifetime } from './enums';
import { ScopedSingletonRegistrationError } from './errors';
import type { IServiceCollection, IServiceProvider } from './interfaces';
import type { ILogger } from './logger';
import type { EnsureObject, InstanceFactory, ServiceBuilder, ServiceCollectionOptions, ServiceDescriptor, ServiceIdentifier, ServiceImplementation, ServiceModuleType, SourceType, UnionToIntersection } from './types';

export class ServiceCollection implements IServiceCollection {
  constructor(
    private readonly logger: ILogger,
    public readonly options: ServiceCollectionOptions,
    private readonly isScoped: boolean,
    private readonly services = new Map<ServiceIdentifier<any>, ServiceDescriptor<any>[]>(),
  ) {}
  public registerModules(...modules: ServiceModuleType[]): void {
    for (const x of modules) {
      const module = new x();
      module.registerServices(this);
    }
  }

  get<T extends SourceType>(key: ServiceIdentifier<T>): ServiceDescriptor<T>[] {
    return this.services.get(key) ?? [];
  }

  public overrideLifetime<T extends SourceType>(identifier: ServiceIdentifier<T>, lifetime: Lifetime): void {
    for (const x of this.get(identifier)) {
      x.lifetime = lifetime;
    }
  }

  register<Types extends SourceType[]>(...identifiers: { [K in keyof Types]: ServiceIdentifier<Types[K]> }): ServiceBuilder<EnsureObject<UnionToIntersection<Types[number]>>> {
    return {
      to: (implementation: ServiceImplementation<any>, factory?: InstanceFactory<any>) => {
        const descriptor: ServiceDescriptor<any> = factory === undefined ? { implementation: implementation as ServiceImplementation<any>, lifetime: Lifetime.Resolve } : { implementation, factory, lifetime: Lifetime.Resolve };

        // Register the same descriptor for all interfaces
        for (const identifier of identifiers) {
          this.addService(identifier, descriptor);
        }

        const builder = {
          singleton: () => {
            if (this.isScoped) {
              throw new ScopedSingletonRegistrationError();
            }
            descriptor.lifetime = Lifetime.Singleton;
            return builder;
          },
          scoped: () => {
            descriptor.lifetime = Lifetime.Scoped;
            return builder;
          },
          transient: () => {
            descriptor.lifetime = Lifetime.Transient;
            return builder;
          },
        };
        return builder;
      },
    };
  }

  private addService<T extends SourceType>(identifier: ServiceIdentifier<T>, descriptor: ServiceDescriptor<T>) {
    this.logger.info('Adding service', { identifier, descriptor });
    let existing = this.services.get(identifier);
    if (existing == null) {
      existing = [];
      this.services.set(identifier, existing);
    }
    existing.push(descriptor);
  }

  public clone(): IServiceCollection;
  public clone(scoped: true): IServiceCollection;
  public clone(scoped?: unknown): IServiceCollection {
    const clonedMap = new Map<ServiceIdentifier<any>, ServiceDescriptor<any>[]>();
    for (const [key, descriptors] of this.services) {
      const clonedDescriptors = descriptors.map((descriptor) => ({ ...descriptor }));
      clonedMap.set(key, clonedDescriptors);
    }

    return new ServiceCollection(this.logger, this.options, scoped === true, clonedMap);
  }

  public buildProvider(): IServiceProvider {
    const cloned = this.clone();
    return new ServiceProvider(this.logger, cloned);
  }
}
