import { ServiceBuilder } from './ServiceBuilder';
import { ServiceProvider } from './ServiceProvider';
import type { Lifetime } from '../enums';
import type { IServiceCollection, IServiceProvider } from '../interfaces';
import type { ILogger } from '../logger';
import type { EnsureObject, IServiceBuilder, ServiceCollectionOptions, ServiceDescriptor, ServiceIdentifier, ServiceModuleType, SourceType, UnionToIntersection } from '../types';

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
    for (const descriptor of this.get(identifier)) {
      descriptor.lifetime = lifetime;
    }
  }

  register<Types extends SourceType[]>(...identifiers: { [K in keyof Types]: ServiceIdentifier<Types[K]> }): IServiceBuilder<EnsureObject<UnionToIntersection<Types[number]>>> {
    return new ServiceBuilder(identifiers, this.isScoped, (identifier, descriptor) => this.addService(identifier, descriptor));
  }

  private addService<T extends SourceType>(identifier: ServiceIdentifier<T>, descriptor: ServiceDescriptor<T>) {
    this.logger.info('Adding service', { identifier: identifier.name, descriptor });
    let existing = this.services.get(identifier);
    if (existing == null) {
      existing = [];
      this.services.set(identifier, existing);
    }
    existing.push(descriptor);
  }

  public clone(scoped?: unknown): IServiceCollection {
    const clonedMap = new Map<ServiceIdentifier<any>, ServiceDescriptor<any>[]>();
    for (const [key, descriptors] of this.services) {
      const clonedDescriptors = descriptors.map((descriptor) => ({ ...descriptor }));
      clonedMap.set(key, clonedDescriptors);
    }

    return new ServiceCollection(this.logger, this.options, scoped === true, clonedMap);
  }

  public buildProvider(): IServiceProvider {
    return new ServiceProvider(this.logger, this.clone());
  }
}
