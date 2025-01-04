export { createServiceCollection } from './createServiceCollection';
export { dependsOn } from './dependsOn';
export { IDisposable, IServiceCollection, IServiceModule, IServiceProvider, IServiceScope } from './interfaces';
export type { AbstractNewable, InstanceFactory, LifetimeBuilder, MetadataType, Newable, ServiceBuilder, ServiceDescriptor, ServiceDescriptorConcrete, ServiceDescriptorFactory, ServiceIdentifier, ServiceImplementation, ServiceModuleType, SourceType, ServiceCollectionOptions } from './types';
export { ResolveMultipleMode, DefaultServiceCollectionOptions } from './types';
export { ILogger } from './logger';
export { MultipleRegistrationError, SelfDependencyError, ServiceCreationError, UnregisteredServiceError, ServiceError } from './errors';
export { Lifetime, LogLevel } from './enums';

export { ServiceCollection } from './ServiceCollection';
export { ServiceProvider } from './ServiceProvider';
