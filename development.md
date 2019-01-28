# Development

Standard commands in directories:

```
# setup
yarn install

# running tests
yarn run test

# linting
yarn run lint
```

Ensure this command passes before committing:

```
yarn run verify
```

## ts-nameof

### Creating Declaration File

The declaration file ([packages/ts-nameof/ts-nameof.d.ts](packages/ts-nameof/ts-nameof.d.ts)) is a concatenation of the the emitted `.d.ts` file of [packages/ts-nameof/src/main.ts](packages/ts-nameof/src/main.ts) and [packages/ts-nameof/src/global.d.ts](packages/ts-nameof/src/global.d.ts).

### Updating API

1. Update the API in `packages/ts-nameof/src/main.ts`.
1. Run `yarn run create-declaration-file`.

### Updating global `nameof` or `nameof.X` functions

1. Update `packages/ts-nameof/src/global.d.ts`.
1. Update [packages/ts-nameof/lib/declarationFileTests.ts](packages/ts-nameof/lib/declarationFileTests.ts) with a failing test (failing test means you get a compile error because `ts-nameof.d.ts` hasn't been updated yet).
1. Run `yarn run create-declaration-file`.
    * This will recreate `ts-nameof.d.ts` and verify that `packages/ts-nameof/lib/declarationFileTests.ts` no longer throws a compile error.
