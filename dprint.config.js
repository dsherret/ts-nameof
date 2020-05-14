// disabled, since not working: @ts-check
const { TypeScriptPlugin } = require("./packages/global-dependencies/node_modules/dprint-plugin-typescript");
const { JsoncPlugin } = require("./packages/global-dependencies/node_modules/dprint-plugin-jsonc");

/** @type { import("./packages/global-dependencies/node_modules/dprint").Configuration } */
module.exports.config = {
    projectType: "openSource",
    lineWidth: 160,
    newLineKind: "auto", // todo: eventually change to default
    plugins: [
        new TypeScriptPlugin({
            useBraces: "preferNone",
            singleBodyPosition: "nextLine",
            preferHanging: true,
            nextControlFlowPosition: "nextLine",
            quoteStyle: "alwaysDouble",
            semiColons: "always",
            trailingCommas: "never", // todo: eventually change to default
            "arrowFunction.useParentheses": "preferNone",
            "tryStatement.nextControlFlowPosition": "sameLine"
        }),
        new JsoncPlugin({
            indentWidth: 2
        })
    ],
    includes: [
        "**/*{.ts,.tsx,.json,.js}"
    ],
    excludes: [
        "common/**",
        "**/dist/**/*.*"
    ]
};
