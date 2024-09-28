import { fail } from 'node:assert';
import { throws } from 'node:assert/strict';
import { ok } from 'node:assert/strict';
import { createServiceCollection } from '../src';
import { MultipleRegistrationError, ServiceError, UnregisteredServiceError } from '../src/errors';
import { ResolveMultipleMode } from '../src/types';

abstract class IService {}
class Service implements IService {}
class OtherService implements IService {}

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

describe('Allow configuring registrations', () => {
  const services = createServiceCollection({ registrationMode: ResolveMultipleMode.LastRegistered });
  services.register(IService).to(Service);
  services.register(IService).to(OtherService);
  const provider = services.buildProvider();
  const svc = provider.resolve(IService);
  ok(svc instanceof OtherService);
});

describe('Catch errors', () => {
  const services = createServiceCollection();
  const provider = services.buildProvider();
  try {
    provider.resolve(IService);
    fail('no error');
  } catch (err) {
    ok(err instanceof ServiceError);
  }
});
