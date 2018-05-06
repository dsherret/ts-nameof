# Using ts-nameof with the TypeScript Transformation API

Transformation plugins are currently not supported by the TypeScript compiler by itself. Please go and upvote [this issue](https://github.com/Microsoft/TypeScript/issues/14419) on TypeScript's issue tracker.

In the meantime, this is possible using [ttypescript](https://github.com/cevek/ttypescript) thanks to [@cevek](https://github.com/cevek)!

## Setup

1. Install `ttypescript` and `ts-nameof`:

    ```bash
    npm install --save-dev ttypescript ts-nameof
    // or
    yarn add --dev ttypescript ts-nameof
    ```

2. Add `ts-nameof` to `tsconfig.json` as a custom transformer:

    ```json
    {
        "compilerOptions": {
            "plugins": [{
                "customTransformers": {
                    "before": ["ts-nameof"]
                }
            }]
        }
    }
    ```

3. Compile with `ttsc` instead of `tsc`:

    ```bash
    npx ttsc
    ```

### Swapping out TypeScript with TTypeScript

Read the instructions at [`ttypescript`'s GitHub page](https://github.com/cevek/ttypescript) for how to use with tools like `webpack`, `webpack`, `ts-node`, visual studio code, etc.

Generally, most build tools have a way to swap out which version of the compiler you use (ex. using environment variables or command line arguments) so this should work across a lot of build tools.
