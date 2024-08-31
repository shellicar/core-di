import type { Lifetime } from './constants';
import type { IServiceModule, IServiceProvider, IServiceScope } from './interfaces';

export type SourceType = object;

export type AbstractNewable<T> = abstract new (...args: any[]) => T;
export type Newable<T> = new (...args: any[]) => T;

export type ServiceIdentifier<T extends SourceType> = { prototype: T; name: string }; //AbstractNewable<T>;
export type ServiceImplementation<T extends SourceType> = Newable<T>;

export type InstanceFactory<T extends SourceType> = (x: IServiceScope & IServiceProvider) => T;

export type ServiceModuleType = Newable<IServiceModule>;

export type ServiceDescriptorFactory<T extends SourceType> = {
  implementation: ServiceIdentifier<T>;
  factory: InstanceFactory<T>;
  lifetime: Lifetime;
};
export type ServiceDescriptorConcrete<T extends SourceType> = {
  implementation: ServiceImplementation<T>;
  lifetime: Lifetime;
};

export type ServiceDescriptor<T extends SourceType> = ServiceDescriptorConcrete<T> | ServiceDescriptorFactory<T>;
// export type ServiceDescriptor<T extends SourceType> = {
//   implementation: ServiceImplementation<T>;
//   factory?: InstanceFactory<T>;
//   lifetime: Lifetime;
// };

export type LifetimeBuilder = {
  singleton: () => LifetimeBuilder;
  scoped: () => LifetimeBuilder;
  transient: () => LifetimeBuilder;
};
export type ServiceBuilder<T extends SourceType> = {
  to: {
    (implementation: ServiceImplementation<T>): LifetimeBuilder;
    (implementation: ServiceIdentifier<T>, factory: InstanceFactory<T>): LifetimeBuilder;
  };
};

export type MetadataType<T extends SourceType> = Record<string | symbol, ServiceIdentifier<T>>;
