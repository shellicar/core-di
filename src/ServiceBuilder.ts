import { Lifetime } from './enums';
import { ScopedSingletonRegistrationError } from './errors';
import type { ILifetimeBuilder, IServiceBuilder, InstanceFactory, ServiceDescriptor, ServiceIdentifier, ServiceImplementation, SourceType } from './types';

export class ServiceBuilder<T extends SourceType> implements IServiceBuilder<T> {
  private descriptor: ServiceDescriptor<T> | undefined;

  constructor(
    private readonly identifiers: ServiceIdentifier<T>[],
    private readonly isScoped: boolean,
    private readonly addService: (identifier: ServiceIdentifier<T>, descriptor: ServiceDescriptor<T>) => void,
  ) {}

  public to(implementation: ServiceImplementation<T>, factory?: InstanceFactory<T>): ILifetimeBuilder {
    this.descriptor = this.createDescriptor(factory, implementation);

    for (const identifier of this.identifiers) {
      this.addService(identifier, this.descriptor);
    }
    return this;
  }

  private createDescriptor(factory: InstanceFactory<T> | undefined, implementation: ServiceImplementation<T>): ServiceDescriptor<T> {
    const lifetime = Lifetime.Resolve;
    if (factory !== undefined) {
      return {
        implementation,
        createInstance(context) {
          return factory(context);
        },
        lifetime,
      };
    }
    return {
      implementation,
      createInstance(context) {
        return new implementation(context);
      },
      lifetime,
    };
  }

  public singleton(): this {
    if (this.isScoped) {
      throw new ScopedSingletonRegistrationError();
    }
    this.ensureDescriptor().lifetime = Lifetime.Singleton;
    return this;
  }

  public scoped(): this {
    this.ensureDescriptor().lifetime = Lifetime.Scoped;
    return this;
  }

  public transient(): this {
    this.ensureDescriptor().lifetime = Lifetime.Transient;
    return this;
  }

  private ensureDescriptor(): ServiceDescriptor<T> {
    if (!this.descriptor) {
      throw new Error('Must call to() before setting lifetime');
    }
    return this.descriptor;
  }
}
