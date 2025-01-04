import { ResolutionContext } from './ResolutionContext';
import { DesignDependenciesKey } from './constants';
import { Lifetime } from '../enums';
import { ResolveMultipleMode } from '../enums';
import { MultipleRegistrationError, SelfDependencyError, ServiceCreationError, UnregisteredServiceError } from '../errors';
import { type IDisposable, IResolutionScope, IScopedProvider, type IServiceCollection } from '../interfaces';
import { IServiceProvider } from '../interfaces';
import type { ILogger } from '../logger';
import { getMetadata } from './metadata';
import type { ServiceDescriptor, ServiceIdentifier, ServiceImplementation, SourceType } from '../types';

export class ServiceProvider implements IServiceProvider, IScopedProvider {
  private scoped = new Map<ServiceImplementation<any>, any>();
  private created: IDisposable[] = [];

  constructor(
    private readonly logger: ILogger,
    public readonly Services: IServiceCollection,
    private readonly singletons = new Map<ServiceImplementation<any>, any>(),
  ) {}

  [Symbol.dispose]() {
    for (const x of this.created) {
      x[Symbol.dispose]();
    }
  }

  private resolveInternal<T extends SourceType>(descriptor: ServiceDescriptor<T>, context: ResolutionContext): T {
    let instance = context.getFromLifetime(descriptor.implementation, descriptor.lifetime);
    if (instance == null) {
      instance = this.createInstance(descriptor, context);
    }
    return instance;
  }

  public resolveAll<T extends SourceType>(identifier: ServiceIdentifier<T>, context?: ResolutionContext): T[] {
    const descriptors = this.Services.get(identifier);
    return descriptors.map((descriptor) => this.resolveInternal<T>(descriptor, context ?? new ResolutionContext(this.singletons, this.scoped)));
  }

  public resolve<T extends SourceType>(identifier: ServiceIdentifier<T>, context?: ResolutionContext): T {
    if (identifier.prototype === IResolutionScope.prototype || identifier.prototype === IScopedProvider.prototype || identifier.prototype === IServiceProvider.prototype) {
      return this as IResolutionScope & IScopedProvider & IServiceProvider as T;
    }

    const descriptor = this.getSingleDescriptor(identifier);
    return this.resolveInternal(descriptor, context ?? new ResolutionContext(this.singletons, this.scoped));
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

  private createInstance<T extends SourceType>(descriptor: ServiceDescriptor<T>, context: ResolutionContext): T {
    const instance = this.createInstanceInternal(descriptor, context);
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

  private createInstanceInternal<T extends SourceType>(descriptor: ServiceDescriptor<T>, context: ResolutionContext) {
    let instance: T | undefined;
    try {
      instance = descriptor.createInstance(this.wrapContext(context));
    } catch (err) {
      this.logger.error(err);
      throw new ServiceCreationError(descriptor.implementation, err);
    }
    if (descriptor.lifetime !== Lifetime.Singleton && Symbol.dispose in instance) {
      this.created.push(instance as IDisposable);
    }
    return instance;
  }

  public createScope(): IScopedProvider {
    return new ServiceProvider(this.logger, this.Services.clone(true), this.singletons);
  }

  private setDependencies<T extends SourceType>(implementation: ServiceImplementation<T>, instance: T, context: ResolutionContext): T {
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
