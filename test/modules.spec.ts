import { ok } from 'node:assert/strict';
import { createServiceCollection, type IServiceCollection, type IServiceModule } from '../src';

class IAbstract {}
class Concrete extends IAbstract {}

class MyModule implements IServiceModule {
  public registerServices(services: IServiceCollection): void {
    services.register(IAbstract).to(Concrete);
  }
}

describe('Service modules', () => {
  it('Can use module', () => {
    const services = createServiceCollection();
    services.registerModules([MyModule]);
    const provider = services.buildProvider();
    const svc = provider.resolve(IAbstract);
    ok(svc instanceof Concrete);
  });
});
