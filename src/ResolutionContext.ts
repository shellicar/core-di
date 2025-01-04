import { Lifetime } from './enums';
import type { ServiceImplementation, SourceType } from './types';

export class ResolutionContext {
  constructor(
    private readonly singletons: Map<ServiceImplementation<any>, any>,
    private readonly scoped: Map<ServiceImplementation<any>, any>,
  ) {}

  private readonly transient = new Map<ServiceImplementation<any>, any>();

  public getFromLifetime<T extends SourceType>(implementation: ServiceImplementation<T>, lifetime: Lifetime): T {
    const map = this.getMapForLifetime(lifetime);
    return map?.get(implementation);
  }

  public setForLifetime<T extends SourceType>(implementation: ServiceImplementation<T>, instance: T, lifetime: Lifetime): void {
    const map = this.getMapForLifetime(lifetime);
    map?.set(implementation, instance);
  }

  private getMapForLifetime(lifetime: Lifetime) {
    const map: Partial<Record<Lifetime, Map<ServiceImplementation<any>, any>>> = {
      [Lifetime.Singleton]: this.singletons,
      [Lifetime.Scoped]: this.scoped,
      [Lifetime.Resolve]: this.transient,
    };
    return map[lifetime];
  }
}
