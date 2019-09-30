import * as assert from "assert";
import { runCommonTests } from "@ts-nameof/tests-common";
import { replaceInText } from "../../text";

describe("replaceInText", () => {
    it("should unofficially maintain backwards compatibility when providing one argument", () => {
        assert.equal((replaceInText as any)("nameof(window);").fileText, `"window";`);
    });

    it("should not replace when no nameof", () => {
        const result = replaceInText("file.ts", "some random text with no nameof in it");
        assert.equal(result.replaced, false);
        assert.equal(result.fileText, undefined);
    });

    it("should replace when there was a nameof", () => {
        const result = replaceInText("file.ts", "describe(nameof(myTest), () => {});");
        assert.equal(result.replaced, true);
        assert.equal(result.fileText, `describe("myTest", () => {});`);
    });

    it("should replace when there was a nameof in tsx file", () => {
        const result = replaceInText("file.tsx", "const t = <div t={nameof(t)} />;");
        assert.equal(result.replaced, true);
        assert.equal(result.fileText, `const t = <div t={"t"} />;`);
    });

    runCommonTests(text => {
        return replaceInText("file.ts", text).fileText || text;
    });
});
