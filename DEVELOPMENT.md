# Development

## Building

Open the root directory of the repo and run:

```ts
yarn install
```

This will cause all the subdirectories to build and correctly reference the other directories.

## Standard Commands

```
# setup
yarn install

# running tests
yarn test

# linting
yarn lint
```

## Declaration File

### Global Definitions

The global definitions are stored in [shared/lib/global.d.ts](shared/lib/global.d.ts). To make changes:

1. Add a failing test in [shared/lib/global.tests.ts](shared/lib/global.tests.ts) (failing test means you get a compile error)
1. Update [shared/lib/global.d.ts](shared/lib/global.d.ts).
1. Run `yarn create-declaration-file` in the root directory which will update all the project's declaration files.

### ts-nameof - Updating API

1. Update [packages/ts-nameof/lib/declarationFileTests.ts](packages/ts-nameof/lib/declarationFileTests.ts) with a failing test.
1. Update the API in [packages/ts-nameof/src/main.ts](packages/ts-nameof/src/main.ts).
1. Run `yarn create-declaration-file`
