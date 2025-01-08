# @shellicar/core-di

> A basic dependency injection library for TypeScript

[![npm package](https://img.shields.io/npm/v/@shellicar/core-di.svg)](https://npmjs.com/package/@shellicar/core-di)
[![build status](https://github.com/shellicar/core-di/actions/workflows/node.js.yml/badge.svg)](https://github.com/shellicar/core-di/actions/workflows/node.js.yml)

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
