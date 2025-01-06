import type { Lifetime, LogLevel, ResolveMultipleMode } from './enums';
import type { ILifetimeBuilder, IResolutionScope, IServiceModule } from './interfaces';
import type { ILogger } from './logger';
import type { ConsoleLogger } from './private/consoleLogger';

export type SourceType = object;

export type AbstractNewable<T> = abstract new (...args: any[]) => T;
export type Newable<T> = new (...args: any[]) => T;

export type ServiceIdentifier<T extends SourceType> = { prototype: T; name: string }; //AbstractNewable<T>;
export type ServiceImplementation<T extends SourceType> = Newable<T>;

export type InstanceFactory<T extends SourceType> = (x: IResolutionScope) => T;

export type ServiceModuleType = Newable<IServiceModule>;

export type ServiceDescriptor<T extends SourceType> = {
  readonly implementation: ServiceImplementation<T>;
  lifetime: Lifetime;
  createInstance(context: IResolutionScope): T;
};

export type MetadataType<T extends SourceType> = Record<string | symbol, ServiceIdentifier<T>>;

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

export type ServiceBuilderOptions<T extends SourceType> = {
  (implementation: ServiceImplementation<T>): ILifetimeBuilder;
  (implementation: ServiceImplementation<T>, factory: InstanceFactory<T>): ILifetimeBuilder;
};
