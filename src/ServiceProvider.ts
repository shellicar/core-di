import { DesignDependenciesKey, Lifetime } from './constants';
import { MultipleRegistrationError, SelfDependencyError, ServiceCreationError, UnregisteredServiceError } from './errors';
import type { IDisposable, IServiceCollection } from './interfaces';
import { IServiceProvider, IServiceScope } from './interfaces';
import type { ILogger } from './logger';
import { getMetadata } from './metadata';
import type { ServiceDescriptor, ServiceIdentifier, ServiceImplementation, SourceType } from './types';
import { ResolveMultipleMode } from './types';

type Id<T extends SourceType> = ServiceIdentifier<T> | ServiceImplementation<T>;

type ResolveMap<T extends SourceType> = Map<ServiceIdentifier<T>, Map<Id<T>, T>>;

const createResolveMap = <T extends SourceType>(): ResolveMap<T> => new Map<ServiceIdentifier<T>, Map<ServiceImplementation<T>, T>>();

export class ServiceProvider implements IServiceProvider, IServiceScope {
  private scoped = createResolveMap();
  private created: IDisposable[] = [];

  constructor(
    private readonly logger: ILogger,
    private readonly services: IServiceCollection,
    private readonly singletons = createResolveMap(),
  ) {}

  public get Services(): IServiceCollection {
    return this.services;
  }

  [Symbol.dispose]() {
    for (const x of this.created) {
      x[Symbol.dispose]();
    }
  }

  private resolveFrom<T extends SourceType>(identifier: ServiceIdentifier<T>, descriptor: ServiceDescriptor<T>, lifetimeMap: ResolveMap<T>, currentResolve: ResolveMap<T>): T {
    let resolvedInstances = lifetimeMap.get(identifier);
    if (resolvedInstances === undefined) {
      resolvedInstances = new Map();
      lifetimeMap.set(identifier, resolvedInstances);
    }

    let instance = resolvedInstances.get(descriptor.implementation);
    if (instance === undefined) {
      instance = this.createInstance(descriptor, currentResolve);
      resolvedInstances.set(descriptor.implementation, instance);
      this.setDependencies<T>(descriptor.implementation, instance, currentResolve);
    }
    return instance;
  }

  private resolveInternal<T extends SourceType>(identifier: ServiceIdentifier<T>, descriptor: ServiceDescriptor<T>, currentResolve: ResolveMap<T>): T {
    const mapping: Partial<Record<Lifetime, ResolveMap<any>>> = {
      [Lifetime.Singleton]: this.singletons,
      [Lifetime.Scoped]: this.scoped,
      [Lifetime.Resolve]: currentResolve,
    };
    const sourceMap = mapping[descriptor.lifetime];
    if (sourceMap === undefined) {
      const instance = this.createInstance(descriptor, currentResolve);
      this.setDependencies<T>(descriptor.implementation, instance, currentResolve);
      return instance;
    }
    return this.resolveFrom(identifier, descriptor, sourceMap, currentResolve);
  }

  public resolveAll<T extends SourceType>(identifier: ServiceIdentifier<T>, currentResolve = createResolveMap<T>()): T[] {
    const descriptors = this.services.get(identifier);
    return descriptors.map((descriptor) => this.resolveInternal<T>(identifier, descriptor, currentResolve));
  }

  public resolve<T extends SourceType>(identifier: ServiceIdentifier<T>, currentResolve = createResolveMap<T>()): T {
    if (identifier.prototype === IServiceScope.prototype || identifier.prototype === IServiceProvider.prototype) {
      return this as unknown as T;
    }

    const descriptors = this.services.get(identifier);
    if (descriptors.length === 0) {
      throw new UnregisteredServiceError(identifier);
    }

    if (descriptors.length > 1) {
      if (this.Services.options.registrationMode === ResolveMultipleMode.Error) {
        throw new MultipleRegistrationError(identifier);
      }
    }
    const descriptor = descriptors[descriptors.length - 1];
    return this.resolveInternal(identifier, descriptor, currentResolve);
  }

  private createInstance<T extends SourceType>(descriptor: ServiceDescriptor<T>, currentResolve: ResolveMap<T>): T {
    let instance: T;
    if ('factory' in descriptor) {
      const factory = descriptor.factory;
      const resolve = (identifier: ServiceIdentifier<any>) => this.resolve(identifier, currentResolve);
      const resolveAll = (identifier: ServiceIdentifier<any>) => this.resolveAll(identifier, currentResolve);
      const createScope = this.createScope.bind(this);

      // proxy requests to keep current resolved types
      try {
        instance = factory({
          resolve,
          resolveAll,
          createScope,
          get Services() {
            return this.Services;
          },
        });
      } catch (err) {
        this.logger.error(err);
        throw new ServiceCreationError(descriptor.implementation, err);
      }
    } else {
      try {
        instance = new descriptor.implementation();
      } catch (err) {
        this.logger.error(err);
        throw new ServiceCreationError(descriptor.implementation, err);
      }
    }
    if (descriptor.lifetime !== Lifetime.Singleton && Symbol.dispose in instance) {
      this.created.push(instance as IDisposable);
    }
    return instance;
  }

  public createScope(): IServiceProvider & IDisposable {
    return new ServiceProvider(this.logger, this.services.clone(true), this.singletons);
  }

  private setDependencies<T extends SourceType>(type: Id<T>, instance: T, currentResolve: ResolveMap<T>): T {
    const dependencies = getMetadata<T>(DesignDependenciesKey, type) ?? {};
    this.logger.debug('Dependencies', type.name, dependencies);
    for (const [key, identifier] of Object.entries(dependencies)) {
      if (identifier !== type) {
        this.logger.debug('Resolving', identifier, 'for', type.name);
        const dep = this.resolve(identifier, currentResolve);
        (instance as Record<string, unknown>)[key] = dep;
      } else {
        throw new SelfDependencyError();
      }
    }
    return instance;
  }
}
