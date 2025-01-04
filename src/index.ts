export { createServiceCollection } from './createServiceCollection';
export { dependsOn } from './dependsOn';
export { IDisposable, IServiceCollection, IServiceModule, IServiceProvider, IResolutionScope, IScopedProvider } from './interfaces';
export type { AbstractNewable, InstanceFactory, ILifetimeBuilder, MetadataType, Newable, IServiceBuilder, ServiceDescriptor, ServiceIdentifier, ServiceImplementation, ServiceModuleType, SourceType, ServiceCollectionOptions } from './types';
export { DefaultServiceCollectionOptions } from './defaults';
export { ILogger } from './logger';
export { MultipleRegistrationError, SelfDependencyError, ServiceCreationError, UnregisteredServiceError, ServiceError, ScopedSingletonRegistrationError } from './errors';
export { ResolveMultipleMode, Lifetime, LogLevel } from './enums';
