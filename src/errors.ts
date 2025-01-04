import type { ServiceIdentifier } from './types';

export abstract class ServiceError extends Error {}

export class UnregisteredServiceError<T extends object> extends ServiceError {
  name = 'UnregisteredServiceError';
  constructor(identifier: ServiceIdentifier<T>) {
    super(`Resolving service that has not been registered: ${identifier.name}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class MultipleRegistrationError<T extends object> extends ServiceError {
  name = 'MultipleRegistrationError';
  constructor(identifier: ServiceIdentifier<T>) {
    super(`Multiple services have been registered: ${identifier.name}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ServiceCreationError<T extends object> extends ServiceError {
  name = 'ServiceCreationError';
  constructor(
    identifier: ServiceIdentifier<T>,
    public readonly innerError: any,
  ) {
    super(`Error creating service: ${identifier.name}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SelfDependencyError extends ServiceError {
  name = 'SelfDependencyError';
  constructor() {
    super('Service depending on itself');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ScopedSingletonRegistrationError extends ServiceError {
  name = 'ScopedSingletonRegistrationError';
  constructor() {
    super('Cannot register a singleton in a scoped service collection');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
