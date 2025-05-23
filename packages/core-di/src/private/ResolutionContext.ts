import { Lifetime } from '../enums';
import { type RegistrationMap, type ServiceRegistration, type SourceType, createRegistrationMap } from '../types';

export class ResolutionContext {
  constructor(
    private readonly singletons: RegistrationMap,
    private readonly scoped: RegistrationMap,
  ) {}

  private readonly transient: RegistrationMap = createRegistrationMap();

  public getFromLifetime<T extends SourceType>(implementation: ServiceRegistration<T>, lifetime: Lifetime): T | null {
    const map = this.getMapForLifetime(lifetime);
    return map?.get(implementation);
  }

  public setForLifetime<T extends SourceType>(implementation: ServiceRegistration<T>, instance: T, lifetime: Lifetime): void {
    const map = this.getMapForLifetime(lifetime);
    map?.set(implementation, instance);
  }

  private getMapForLifetime(lifetime: Lifetime) {
    const map: Partial<Record<Lifetime, RegistrationMap>> = {
      [Lifetime.Singleton]: this.singletons,
      [Lifetime.Scoped]: this.scoped,
      [Lifetime.Resolve]: this.transient,
    };
    return map[lifetime];
  }
}
