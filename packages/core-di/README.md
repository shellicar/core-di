# @shellicar/core-di

> A basic dependency injection library for TypeScript

[![npm package](https://img.shields.io/npm/v/@shellicar/core-di.svg)](https://npmjs.com/package/@shellicar/core-di)
[![build status](https://github.com/shellicar/core-di/actions/workflows/node.js.yml/badge.svg)](https://github.com/shellicar/core-di/actions/workflows/node.js.yml)

## Installation & Quick Start

```sh
pnpm install @shellicar/core-di
```

## Quick Example

```typescript
import { Container, injectable } from '@shellicar/core-di';

@injectable()
class Foo {
  sayHello() {
    console.log('Hello from Foo');
  }
}

const container = new Container();
const foo = container.resolve(Foo);
foo.sayHello();
```

## Documentation

For full documentation, visit [here](https://github.com/shellicar/core-di).
