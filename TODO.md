# TODO

Future work, ideas, and potential improvements for `@shellicar/core-di`.

## Background

This library started as a replacement for `inversify` (which is stuck on TypeScript v4) and is modelled after `Microsoft.Extensions.DependencyInjection`. It uses property injection via `@dependsOn` decorators and abstract classes as runtime-resolvable interfaces.

## Priority Key

Each item is scored 1-5 on two axes, then combined:

- **Value** = Urgency x Importance (how much it matters and how soon)
- **Cost** = Effort to implement (1 = trivial, 5 = major undertaking)
- **Priority** = Value / Cost (higher is better)

## Items

### ~~1. Circular dependency detection — Done (v3.1.4)~~

Fixed in v3.1.4. All circular dependencies now throw `CircularDependencyError`. Self-dependency check fixed to correctly throw `SelfDependencyError`. 7 tests added covering self-dependency, 2-node cycles, and 3-node cycles across all lifetimes.

### ~~2. Routine dependency updates — Done~~

Syncpack 13→14 completed in PR #20, resolving minimatch ReDoS CVE (CVE-2026-26996). Remaining minor/patch updates (`@biomejs/biome`, `turbo`, `@types/node`, `npm-check-updates`, `lefthook`) can be done in a future maintenance pass.

### ~~3. Singleton disposal — Done~~

Fixed: root provider now disposes singleton `IDisposable` instances when disposed, matching MS DI behaviour. Scoped providers still correctly skip singleton disposal. 4 tests added covering singleton, scoped, and transient disposal lifecycle.

### 4. Separate resolution graph from resolution — Priority: 1.5

| Value | Cost | Priority |
|-------|------|----------|
| 3     | 4    | ~1.5     |

Currently `ResolutionContext` tracks resolved instances per-lifetime, but the dependency graph is walked implicitly during resolution. Separating graph construction from instance creation would enable:

- Better circular dependency error messages (detect cycles before attempting construction)
- Graph validation at `buildProvider()` time rather than at first `resolve()` call
- Potential for graph visualisation/debugging tools
- Clearer separation of concerns

Significant architectural change. Would likely require a major version bump. Worth doing when investing in the next evolution of the library, not as a maintenance task.

### 5. Async resolution — Priority: 0.5

| Value | Cost | Priority |
|-------|------|----------|
| 2     | 5    | ~0.5     |

MS DI (`Microsoft.Extensions.DependencyInjection`) does not support async resolution, and no clean pattern has emerged for this. Known approaches and their tradeoffs:

1. **Async factory functions** (`resolveAsync`) — Works, but splits the API into sync/async paths. Every consumer must decide which to call.
2. **Two-phase initialisation** — Resolve synchronously, then call an `initAsync()` method. Keeps DI simple but pushes async concerns to consumers.
3. **Startup/initialisation hooks** — Register async initialisers separately, run them after the graph is built. Clean separation but adds ceremony.

None are particularly satisfying. Park until a concrete use case forces the issue or a good pattern emerges.
