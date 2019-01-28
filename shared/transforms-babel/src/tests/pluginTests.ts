/* barrel:ignore */
import * as babel from "@babel/core";
import { runCommonTests } from "../external/test-common";
import plugin from "../index";
import "@babel/preset-typescript";

runCommonTests(run);

function run(text: string) {
    return babel.transformSync(text, {
        presets: [
            "@babel/preset-typescript"
        ],
        plugins: [
            plugin
        ],
        filename: "test.ts",
        ast: false,
        generatorOpts: {
            retainLines: true
        }
    })!.code!;
}
