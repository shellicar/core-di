import { Lifetime, ResolveMultipleMode } from '../enums';
import { MultipleRegistrationError, SelfDependencyError, ServiceCreationError, UnregisteredServiceError } from '../errors';
import { type IDisposable, IResolutionScope, IScopedProvider, type IServiceCollection, IServiceProvider } from '../interfaces';
import type { ILogger } from '../logger';
import { createRegistrationMap, type ServiceDescriptor, type ServiceIdentifier, type ServiceImplementation, type ServiceRegistration, type SourceType } from '../types';
import { DesignDependenciesKey } from './constants';
import { getMetadata } from './metadata';
import { ResolutionContext } from './ResolutionContext';

export class ServiceProvider implements IServiceProvider, IScopedProvider {
  private scoped = createRegistrationMap();
  private created: IDisposable[] = [];

  constructor(
    private readonly logger: ILogger,
    public readonly Services: IServiceCollection,
    private readonly singletons = createRegistrationMap(),
  ) {}

  [Symbol.dispose]() {
    for (const x of this.created) {
      x[Symbol.dispose]();
    }
  }

  private resolveInternal<T extends SourceType>(descriptor: ServiceDescriptor<T>, context: ResolutionContext, serviceIdentifier?: ServiceIdentifier<T>): T {
    let instance = context.getFromLifetime(descriptor.implementation, descriptor.lifetime);
    if (instance == null) {
      instance = this.createInstance(descriptor, context, serviceIdentifier);
    }
    return instance;
  }

  public resolveAll<T extends SourceType>(identifier: ServiceIdentifier<T>, context?: ResolutionContext): T[] {
    const descriptors = this.Services.get(identifier);
    const resolveContext = context ?? new ResolutionContext(this.singletons, this.scoped, identifier);
    return descriptors.map((descriptor) => this.resolveInternal<T>(descriptor, resolveContext, identifier));
  }

  public resolve<T extends SourceType>(identifier: ServiceIdentifier<T>, context?: ResolutionContext): T {
    if (identifier.prototype === IResolutionScope.prototype || identifier.prototype === IScopedProvider.prototype || identifier.prototype === IServiceProvider.prototype) {
      return this as IResolutionScope & IScopedProvider & IServiceProvider as T;
    }

    const descriptor = this.getSingleDescriptor(identifier);
    const resolveContext = context ?? new ResolutionContext(this.singletons, this.scoped, identifier);
    try {
      return this.resolveInternal(descriptor, resolveContext, identifier);
    } catch (err) {
      throw this.wrapDependencyResolutionError(err, identifier, descriptor, resolveContext);
    }
  }

  private wrapDependencyResolutionError<T extends SourceType>(err: unknown, requestedIdentifier: ServiceIdentifier<T>, descriptor: ServiceDescriptor<T>, context: ResolutionContext): never {
    if (err instanceof ServiceCreationError && err.identifier !== requestedIdentifier) {
      throw new ServiceCreationError(requestedIdentifier, err, descriptor.implementation);
    }
    throw err;
  }

  private getSingleDescriptor<T extends SourceType>(identifier: ServiceIdentifier<T>) {
    const descriptors = this.Services.get(identifier);
    if (descriptors.length === 0) {
      throw new UnregisteredServiceError(identifier);
    }

    if (descriptors.length > 1) {
      if (this.Services.options.registrationMode === ResolveMultipleMode.Error) {
        throw new MultipleRegistrationError(identifier);
      }
    }
    const descriptor = descriptors[descriptors.length - 1];
    return descriptor;
  }

  private createInstance<T extends SourceType>(descriptor: ServiceDescriptor<T>, context: ResolutionContext, serviceIdentifier?: ServiceIdentifier<T>): T {
    const instance = this.createInstanceInternal(descriptor, context, serviceIdentifier);
    this.setDependencies(descriptor.implementation, instance, context);
    context.setForLifetime(descriptor.implementation, instance, descriptor.lifetime);
    return instance;
  }

  private wrapContext(context: ResolutionContext): IResolutionScope {
    const resolve = (identifier: ServiceIdentifier<any>) => this.resolve(identifier, context);
    const resolveAll = (identifier: ServiceIdentifier<any>) => this.resolveAll(identifier, context);

    return {
      resolve,
      resolveAll,
    };
  }

  private createInstanceInternal<T extends SourceType>(descriptor: ServiceDescriptor<T>, context: ResolutionContext, serviceIdentifier?: ServiceIdentifier<T>) {
    let instance: T | undefined;
    try {
      instance = descriptor.createInstance(this.wrapContext(context));
    } catch (err) {
      this.logger.error(err);
      const identifier = serviceIdentifier || descriptor.implementation;
      if (err instanceof Error) {
        throw new ServiceCreationError(identifier, err, descriptor.implementation);
      }
      throw new ServiceCreationError(identifier, undefined, descriptor.implementation);
    }
    if (descriptor.lifetime !== Lifetime.Singleton && Symbol.dispose in instance) {
      this.created.push(instance as IDisposable);
    }
    return instance;
  }

  public createScope(): IScopedProvider {
    return new ServiceProvider(this.logger, this.Services.clone(true), this.singletons);
  }

  private setDependencies<T extends SourceType>(implementation: ServiceRegistration<T>, instance: T, context: ResolutionContext): T {
    const dependencies = getMetadata<T>(DesignDependenciesKey, implementation) ?? {};
    this.logger.debug('Dependencies', implementation.name, dependencies);
    for (const [key, identifier] of Object.entries(dependencies)) {
      if (identifier !== implementation) {
        this.logger.debug('Resolving', identifier.name, 'for', implementation.name);
        const dep = this.resolve(identifier, context);
        (instance as Record<string, T>)[key] = dep;
      } else {
        throw new SelfDependencyError();
      }
    }
    return instance;
  }
}
