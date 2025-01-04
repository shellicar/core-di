import type { ConsoleLogger } from './consoleLogger';
import { type Lifetime, LogLevel } from './enums';
import type { IServiceModule, IServiceProvider, IServiceScope } from './interfaces';
import type { ILogger } from './logger';

export type SourceType = object;

export type AbstractNewable<T> = abstract new (...args: any[]) => T;
export type Newable<T> = new (...args: any[]) => T;

export type ServiceIdentifier<T extends SourceType> = { prototype: T; name: string }; //AbstractNewable<T>;
export type ServiceImplementation<T extends SourceType> = Newable<T>;

export type InstanceFactory<T extends SourceType> = (x: IServiceScope & IServiceProvider) => T;

export type ServiceModuleType = Newable<IServiceModule>;

export type ServiceDescriptorFactory<T extends SourceType> = {
  implementation: ServiceImplementation<T>;
  factory: InstanceFactory<T>;
  lifetime: Lifetime;
};
export type ServiceDescriptorConcrete<T extends SourceType> = {
  implementation: ServiceImplementation<T>;
  lifetime: Lifetime;
};

export type ServiceDescriptor<T extends SourceType> = ServiceDescriptorConcrete<T> | ServiceDescriptorFactory<T>;

export type LifetimeBuilder = {
  singleton: () => LifetimeBuilder;
  scoped: () => LifetimeBuilder;
  transient: () => LifetimeBuilder;
};
export type ServiceBuilder<T extends SourceType> = {
  to: {
    (implementation: ServiceImplementation<T>): LifetimeBuilder;
    (implementation: ServiceImplementation<T>, factory: InstanceFactory<T>): LifetimeBuilder;
  };
};

export type MetadataType<T extends SourceType> = Record<string | symbol, ServiceIdentifier<T>>;

export const ResolveMultipleMode = {
  Error: 'ERROR',
  LastRegistered: 'LAST_REGISTERED',
} as const;
export type ResolveMultipleMode = (typeof ResolveMultipleMode)[keyof typeof ResolveMultipleMode];

// export const LogLevel = {
//   Debug: 0,
//   Info: 1,
//   Warn: 2,
//   Error: 3,
//   None: 4,
// } as const;
// export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export const DefaultServiceCollectionOptions: ServiceCollectionOptions = {
  registrationMode: ResolveMultipleMode.Error,
  logLevel: LogLevel.Warn,
};

export type ServiceCollectionOptions = {
  /**
   * Whether calling `resolve` when there are multiple registrations
   * will result in an error or resolve the last registered service.
   * @default ResolveMultipleMode.Error
   */
  registrationMode: ResolveMultipleMode;
  /**
   * The default log level for the console logger.
   * @defaultValue {@link LogLevel.Warn}
   */
  logLevel: LogLevel;
  /**
   * Custom implementation for logger. Ignores log level.
   * @defaultValue {@link ConsoleLogger}
   */
  logger?: ILogger;
};

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type EnsureObject<T> = T extends object ? T : never;
