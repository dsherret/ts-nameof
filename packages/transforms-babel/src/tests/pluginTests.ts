import * as babel from "@babel/core";
import "@babel/preset-typescript";
import { runCommonTests } from "@ts-nameof/tests-common";
import * as path from "path";
import { plugin } from "../index";

runCommonTests(run);

function run(text: string) {
    return babel.transformSync(text, {
        presets: [
            "@babel/preset-typescript",
        ],
        plugins: [
            plugin,
        ],
        filename: path.resolve(__dirname, "test.ts"),
        ast: false,
        generatorOpts: {
            retainLines: true,
        },
    })!.code!;
}
