# Development

TODO: I need to update this file with new monorepo instructions.

Standard commands:

```
# setup
yarn install

# running tests
yarn run test

# linting
yarn run lint
yarn run lint:fix
```

Ensure this command passes before committing:

```
yarn run verify
```

## Creating Declaration File

The declaration file ([ts-nameof.d.ts](ts-nameof.d.ts)) is a concatenation of the the emitted `.d.ts` file of [src/main.ts](src/main.ts) and [src/global.d.ts](src/global.d.ts).

### Updating API

1. Update the API in `src/main.ts`.
1. Run `yarn run create-declaration-file`.

### Updating global `nameof` or `nameof.X` functions

1. Update `src/global.d.ts`.
1. Update [lib/declarationFileTests.ts](lib/declarationFileTests.ts) with a failing test (failing test means you get a compile error because `ts-nameof.d.ts` hasn't been updated yet).
1. Run `yarn run create-declaration-file`.
    * This will recreate `ts-nameof.d.ts` and verify that `lib/declarationFileTests.ts` no longer throws a compile error.
