/* barrel:ignore */
import * as assert from "assert";
import { replaceInText } from "../../main";

export function runTest(text: string, expected: string) {
    const result = replaceInText(text);
    assert.equal(result.fileText || text, expected);
}

export function runThrowTest(text: string) {
    assert.throws(() => replaceInText(text));
}
