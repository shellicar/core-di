import { createServiceCollection } from '../src';
import { throws } from 'node:assert/strict';
import { MultipleRegistrationError, UnregisteredServiceError } from '../src/errors';

abstract class IService {}
class Service implements IService {}

describe('Unregistered', () => {
  const services = createServiceCollection();
  const provider = services.buildProvider();
  throws(() => provider.resolve(IService), UnregisteredServiceError);
});

describe('Multiple registrations', () => {
  const services = createServiceCollection();
  services.register(IService).to(Service);
  services.register(IService).to(Service);
  const provider = services.buildProvider();
  throws(() => provider.resolve(IService), MultipleRegistrationError);
});
