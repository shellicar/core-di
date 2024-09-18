export { createServiceCollection } from './createServiceCollection';
export { dependsOn } from './dependsOn';
export { IDisposable, IServiceCollection, IServiceModule, IServiceProvider, IServiceScope } from './interfaces';
export type { AbstractNewable, InstanceFactory, LifetimeBuilder, MetadataType, Newable, ServiceBuilder, ServiceDescriptor, ServiceDescriptorConcrete, ServiceDescriptorFactory, ServiceIdentifier, ServiceImplementation, ServiceModuleType, SourceType, ServiceCollectionOptions, } from './types';
export { ResolveMultipleMode, DefaultServiceCollectionOptions, } from './types';
export { enable, disable, } from './debug';
export { MultipleRegistrationError, SelfDependencyError, ServiceCreationError, UnregisteredServiceError, ServiceError } from './errors';

export { ServiceCollection } from './ServiceCollection';
export { ServiceProvider } from './ServiceProvider';
