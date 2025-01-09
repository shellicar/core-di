# @shellicar/core-di

> A basic dependency injection library for TypeScript

## Installation & Quick Start

```sh
npm i --save @shellicar/core-di
```

```sh
pnpm add @shellicar/core-di
```

```ts
import { createServiceCollection } from '@shellicar/core-di';

abstract class IAbstract {}
class Concrete implements IAbstract {}

const services = createServiceCollection();
services.register(IAbstract).to(Concrete);
const provider = services.buildProvider();

const svc = provider.resolve(IAbstract);
```

## Documentation

For full documentation, visit [here](https://github.com/shellicar/core-di).
