import { Lifetime } from '../enums';
import type { ServiceIdentifier, ServiceImplementation, ServiceRegistration, SourceType } from '../types';

export class ResolutionContext {
  constructor(
    private readonly singletons: Map<ServiceIdentifier<any> | ServiceImplementation<any>, any>,
    private readonly scoped: Map<ServiceIdentifier<any> | ServiceImplementation<any>, any>,
  ) {}

  private readonly transient = new Map<ServiceImplementation<any>, any>();

  public getFromLifetime<T extends SourceType>(implementation: ServiceRegistration<T>, lifetime: Lifetime): T {
    const map = this.getMapForLifetime(lifetime);
    return map?.get(implementation);
  }

  public setForLifetime<T extends SourceType>(implementation: ServiceRegistration<T>, instance: T, lifetime: Lifetime): void {
    const map = this.getMapForLifetime(lifetime);
    map?.set(implementation, instance);
  }

  private getMapForLifetime(lifetime: Lifetime) {
    const map: Partial<Record<Lifetime, Map<ServiceIdentifier<any> | ServiceImplementation<any>, any>>> = {
      [Lifetime.Singleton]: this.singletons,
      [Lifetime.Scoped]: this.scoped,
      [Lifetime.Resolve]: this.transient,
    };
    return map[lifetime];
  }
}
