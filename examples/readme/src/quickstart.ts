import { createServiceCollection } from '@shellicar/core-di';
import { Concrete, IAbstract } from './helpers/examples';
const services = createServiceCollection();
services.register(IAbstract).to(Concrete);
const provider = services.buildProvider();
const svc = provider.resolve(IAbstract);
