/// <reference path="../references.d.ts" />
import * as path from "path";
import { runCommonTests } from "../external/test-common";
import * as babel from "@babel/core";
import babelPluginMacros from "babel-plugin-macros";
import "@babel/preset-typescript";

runCommonTests(run, { commonPrefix: "import nameof from './ts-nameof.macro';\n" });

function run(text: string) {
    return babel.transformSync(text, {
        presets: [
            "@babel/preset-typescript"
        ],
        plugins: [
            babelPluginMacros
        ],
        filename: path.join(__dirname, "test.ts"),
        ast: false,
        generatorOpts: {
            retainLines: true
        }
    })!.code!;
}
