/// <reference path="../references.d.ts" />
import * as assert from "assert";
import * as path from "path";
import { runCommonTests } from "../external/test-common";
import * as babel from "@babel/core";
import babelPluginMacros from "babel-plugin-macros";
import "@babel/preset-typescript";

runCommonTests(run, { commonPrefix: "import nameof from './ts-nameof.macro';\n" });

describe("using a name other than nameof", () => {
    it("should work when using a different import name", () => {
        const text = "import other from './ts-nameof.macro';other(console.log);other.full(console.log);";
        assert.equal(run(text), `"log";"console.log";`);
    });
});

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
