import type { ServiceIdentifier } from './types';

export class UnregisteredServiceError<T extends object> extends Error {
  constructor(identifier: ServiceIdentifier<T>) {
    super(`Resolving service that has not been registered: ${identifier}`);
  }
}

export class MultipleRegistrationError<T extends object> extends Error {
  constructor(identifier: ServiceIdentifier<T>) {
    super(`Multiple services have been registered: ${identifier}`);
  }
}

export class SelfDependencyError extends Error {
  constructor() {
    super('Service depending on itself');
  }
}
