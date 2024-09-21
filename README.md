# @shellicar/core-di

A basic dependency injection library.

## Motivation

Coming from .NET I am used to DI frameworks/libraries such as `Autofac`, `Ninject`, `StructureMap`, `Unity`, and Microsoft's own `DependencyInjection`.

I started using `InversifyJS`, and tried out some others along the way, such as `diod`.

With TypeScript 5.0 generally available with non-experimental decorators, most DI libraries have not been updated, so I decided to create my own.

## Features

My set of features is simple, based on my current usage

* Type-safe registration.
```ts
const services = createServiceCollection();
abstract class IAbstract { abstract method(): void; }
abstract class Concrete {}
services.register(IAbstract).to(Concrete);
//                                ^ Error
```
* Type-safe resolution.
```ts
const provider = services.buildProvider();
const svc = provider.resolve(IMyService);
//    ^ IMyService
```
* Provide factory methods for instantiating classes.
```ts
services.register(Redis).to(Redis, x => {
  const options = x.resolve(IRedisOptions);
  return new Redis({
    port: options.port,
    host: options.host,
  });
});
```
* Use property injection with decorators for simple dependency definition.
```ts
abstract class IDependency {}
class Service implements IService {
  @dependsOn(IDependency) private readonly dependency!: IDependency;
}
```
* Provide multiple implementations for identifiers and provide a `resolveAll` method.
* Define instance lifetime with simple builder pattern.

```ts
services.register(IAbstract).to(Concrete).singleton();
```

* Create scopes to allow "per-request" lifetimes.
```ts
const services = createServiceCollection();
const provider = services.buildProvider();
using scope = provider.createScope();
```

* Register classes during a scope
```ts
using scope = provider.createScope();
scope.Services.register(IContext).to(Context);
```
* Override registrations (e.g.: for testing)
```ts
import { ok } from 'node:assert/strict';
const services = createServiceCollection({ registrationMode: ResolveMultipleMode.LastRegistered });
services.register(IOptions).to(Options);
// Later
services.register(IOptions).to(MockOptions);
const provider = services.buildProvider();
const options = provider.resolve(IOptions);
ok(options instanceof MockOptions);
```
* Logging options
```ts
import { createServiceCollection, ILogger, LogLevel } from '@shellicar/core-di';

class CustomLogger extends ILogger {
  public override debug(message?: any, ...optionalParams: any[]): void {
    // custom implementation  
  }
}
// Override default logger
const services1 = createServiceCollection({ logger: new CustomLogger() });
// Override default log level
const services2 = createServiceCollection({ logLevel: LogLevel.Debug });
```
* Service modules
```ts
class IAbstract {}
class Concrete extends IAbstract {}

class MyModule implements IServiceModule {
  public registerServices(services: IServiceCollection): void {
    services.register(IAbstract).to(Concrete);
  }
}

const services = createServiceCollection();
services.registerModules([MyModule]);
const provider = services.buildProvider();
const svc = provider.resolve(IAbstract);
```

## Usage

Check the test files for different usage scenarios.

```ts
import { dependsOn, createServiceCollection, IServiceModule, type IServiceCollection } from '@shellicar/core-di';

// Define the dependency interface
abstract class IClock {
  abstract now(): Date;
}
// And implementation
class DefaultClock implements IClock {
  now(): Date {
    return new Date();
  }
}

// Define your interface
abstract class IDatePrinter {
  abstract handle(): string;
}
// And implementation
class DatePrinter implements IDatePrinter {
  @dependsOn(IClock) public readonly clock!: IClock;

  handle(): string {
    return `The time is: ${this.clock.now().toISOString()}`;
  }  
}

class TimeModule extends IServiceModule {
  public registerServices(services: IServiceCollection): void {
    services.register(IClock).to(DefaultClock).singleton();
    services.register(IDatePrinter).to(DatePrinter).scoped();
  }
}

// Register and build provider
const services = createServiceCollection();
services.registerModules([TimeModule]);
const sp = services.buildProvider();

// Optionally create a scope
using scope = sp.createScope();

// Resolve the interface
const svc = scope.resolve(IDatePrinter);
console.log(svc.handle());
```

## Inspired by

* [InversifyJS](https://github.com/inversify/InversifyJS)
* [Microsoft.Extensions.DependencyInjection](https://github.com/dotnet/runtime/tree/main/src/libraries/Microsoft.Extensions.DependencyInjection)
