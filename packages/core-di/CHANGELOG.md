# Changelog

## [2.0.0] - 2025-01-05

### Breaking

- Some exported types changed names/functionality:
  - `LifetimeBuilder` -> `ILifetimeBuilder`
  - `ServiceBuilder` -> `IServiceBuilder`
  - `IServiceScope` -> `IResolutionScope` and `IScopedProvider`
- No longer export `ServiceCollection` and `ServiceProvider`
- Factory methods now take `IResolutionScope` instead of `IServiceScope & IServiceProvider`

### Added

- Extend `IServiceCollection.register` to accept multiple interfaces (ServiceIdentifiers).
  - All interfaces will resolve to the same implementation (and hence, instance, respectful of lifetime)
- Add `IServiceCollection.overrideLifetime` to allow overriding the lifetime of all service descriptors matching the service identifier (mainly for testing scenarios)

### Dev

- Switch to vitest ⚡ from mocha ☕.

## [1.0.0] - 2024-09-29

### Fixed

- Prevent registration of singletons in scoped provider.

## [0.1.0] - 2024-09-22

### Added

- Ability to customise logging.
- More tests and examples.

### Changed

- Use `tsup` for build.

### Removed

- `enable` and `disable` log functions.

## [0.0.4] - 2024-09-18

### Added

- Ability to configure ServiceCollection/Provider.
- Ability to override registrations.

## [0.0.3] - 2024-09-15

### Added

- Ability to register during scope.

### Changed

- Use `pkgroll` for build.

## [0.0.2] - 2024-08-31

### Changed

- Use `@abraham/reflection` instead of `reflect-metadata`.

## [0.0.1] - 2024-08-31

Initial release.

[1.1.0]: https://github.com/shellicar/core-di/releases/tag/1.1.0
[1.0.0]: https://github.com/shellicar/core-di/releases/tag/1.0.0
[0.1.0]: https://github.com/shellicar/core-di/releases/tag/0.1.0
[0.0.4]: https://github.com/shellicar/core-di/releases/tag/0.0.4
[0.0.3]: https://github.com/shellicar/core-di/releases/tag/0.0.3
[0.0.2]: https://github.com/shellicar/core-di/releases/tag/0.0.2
[0.0.1]: https://github.com/shellicar/core-di/releases/tag/0.0.1