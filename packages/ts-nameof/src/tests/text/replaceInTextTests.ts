import * as assert from "assert";
import { runCommonTests } from "ts-nameof-tests-common";
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

    runCommonTests(runTest, runThrowTest);
});

function runTest(text: string, expected: string) {
    const result = replaceInText("file.ts", text);
    assert.equal(result.fileText || text, expected);
}

function runThrowTest(text: string, expectedMessage?: string) {
    if (expectedMessage != null)
        expectedMessage = "[ts-nameof]: " + expectedMessage;

    // for some reason, assert.throws was not working
    try {
        replaceInText("file.ts", text);
    } catch (ex) {
        if (expectedMessage != null)
            assert.equal((ex as any).message, expectedMessage);
        return;
    }

    throw new Error("Expected to throw");
}
