# @shellicar/core-di

> A basic dependency injection library for TypeScript

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
