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

### 1. Circular dependency unit tests — Priority: 5

| Value | Cost | Priority |
|-------|------|----------|
| 5     | 1    | 5        |

Add unit tests to verify and document current circular reference behaviour across all lifetimes. No code changes needed — just tests that pin down existing behaviour.

**Current behaviour:**
- **Self-dependency** (A→A): Detected, throws `SelfDependencyError`
- **Indirect cycles** (A→B→A) with `Resolve`/`Singleton`/`Scoped` lifetimes: `ResolutionContext` cache returns the partially-constructed instance, preventing infinite recursion (but the dependent gets an incomplete instance)
- **Indirect cycles with `Transient` lifetime**: No protection — will stack overflow, as `Transient` has no cache map

**Action:** Write tests, confirm behaviour, then decide if any of it needs fixing.

### 2. Routine dependency updates — Priority: 5

| Value | Cost | Priority |
|-------|------|----------|
| 5     | 1    | 5        |

- `syncpack` 13→14 (resolves minimatch ReDoS CVE, dev-only)
- `@biomejs/biome`, `turbo`, `@types/node`, `npm-check-updates`, `lefthook` — minor/patch updates

Pure hygiene. Clears the audit CVE. No design decisions.

### 3. Singleton disposal verification — Priority: 4

| Value | Cost | Priority |
|-------|------|----------|
| 4     | 1    | 4        |

Currently `Transient` and `Scoped` `IDisposable` instances are tracked and disposed when the provider/scope is disposed. Singleton instances are **not** disposed (see `ServiceProvider.ts:105`). This mirrors MS DI behaviour where singleton disposal is the responsibility of the root container's disposal. Write a test or two to confirm, then document the expected lifecycle.

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
