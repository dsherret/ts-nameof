import * as path from "path";
import * as babel from "@babel/core";
import { runCommonTests } from "@ts-nameof/tests-common";
import { plugin } from "../index";
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
        filename: path.resolve(__dirname, "test.ts"),
        ast: false,
        generatorOpts: {
            retainLines: true
        }
    })!.code!;
}
