import { createServiceCollection } from '@shellicar/core-di';
import { MyModule } from './MyModule.js';
import { IMyOtherService } from './interfaces.js';

const services = createServiceCollection();
services.registerModules(MyModule);
const provider = services.buildProvider();

using scope = provider.createScope();

const svc = scope.resolve(IMyOtherService);
console.log(svc.test());
