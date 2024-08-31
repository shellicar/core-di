import type { SourceType, ServiceBuilder, ServiceDescriptor, ServiceIdentifier, ServiceModuleType } from './types';

export abstract class IDisposable {
  public abstract [Symbol.dispose]: () => void;
}

export abstract class IServiceModule {
  public abstract registerServices(services: IServiceCollection): void;
}

export abstract class IServiceScope {
  public abstract resolve<T extends SourceType>(identifier: ServiceIdentifier<T>): T;
  public abstract resolveAll<T extends SourceType>(identifier: ServiceIdentifier<T>): T[];
}

export abstract class IServiceProvider extends IServiceScope {
  public abstract createScope(): IServiceScope & IDisposable;
}

export abstract class IServiceCollection {
  public abstract get<T extends SourceType>(key: ServiceIdentifier<T>): ServiceDescriptor<T>[];
  public abstract register<T extends SourceType>(identifier: ServiceIdentifier<T>): ServiceBuilder<T>;
  public abstract registerModules(modules: ServiceModuleType[]): void;
  public abstract buildProvider(): IServiceProvider;
  public abstract clone(): IServiceCollection;
}
