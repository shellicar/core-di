import { describe, it } from 'mocha';
import { dependsOn, IDisposable, createServiceCollection } from '../src';
import { ok } from 'node:assert/strict';

abstract class IBottom {}
abstract class ITop extends IDisposable {
  abstract readonly bottom: IBottom;
  abstract get disposed(): boolean;
}

class Bottom implements IBottom {}
class Top implements ITop {
  @dependsOn(IBottom) public readonly bottom!: IBottom;
  public get disposed() { return this.#disposed; }
  #disposed = false;
  public [Symbol.dispose]() {
    this.#disposed = true;
  }
}

describe('Disposable services', () => {
  const services = createServiceCollection();
  services.register(IBottom).to(Bottom);
  services.register(ITop).to(Top);

  const provider = services.buildProvider();
  const scoped = provider.createScope();

  it('will dispose created services', () => {
    const svc = scoped.resolve(ITop);
    scoped[Symbol.dispose]();
    ok(svc.disposed);
  });

  it('service not disposed normally', () => {
    const svc = scoped.resolve(ITop);
    ok(!svc.disposed);
  });
});
