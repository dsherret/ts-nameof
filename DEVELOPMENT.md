# Development

## Building

Open the root directory of the repo and run:

```ts
yarn install
yarn bootstrap
yarn build
```

This will cause all the subdirectories to build and correctly reference the other directories.

## Standard Commands

```
# setup
yarn bootstrap

# running tests
yarn test

# format
yarn format
```

## Declaration File

### Global Definitions

The global definitions are stored in [lib/global.d.ts](lib/global.d.ts). To make changes:

1. Add a failing test in [lib/global.tests.ts](lib/global.tests.ts) (failing test means you get a compile error)
1. Update [lib/global.d.ts](lib/global.d.ts).
1. Run `yarn create-declaration-file` in the root directory which will update all the project's declaration files.

### ts-nameof - Updating API

1. Update [packages/ts-nameof/lib/declarationFileTests.ts](packages/ts-nameof/lib/declarationFileTests.ts) with a failing test.
1. Update the API in [packages/ts-nameof/src/main.ts](packages/ts-nameof/src/main.ts).
1. Run `yarn create-declaration-file`
