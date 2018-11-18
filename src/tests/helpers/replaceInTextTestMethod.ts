/* barrel:ignore */
import * as assert from "assert";
import { replaceInText } from "../../main";

export function runTest(text: string, expected: string) {
    const result = replaceInText("file.ts", text);
    assert.equal(result.fileText || text, expected);
}

export function runThrowTest(text: string, expectedMessage?: string) {
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
