/* barrel:ignore */
import * as assert from "assert";
import * as ts from "typescript";
import { transformerFactory } from "../../transformation";

export function runTest(text: string, expected: string) {
    const results = run(text);
    assert.equal(results[0].fileText.trim(), expected.trim());
}

export function runThrowTest(text: string, expectedMessage?: string) {
    if (expectedMessage != null)
        expectedMessage = "[ts-nameof]: " + expectedMessage;

    // for some reason, assert.throws was not working
    try {
        run(text);
    } catch (ex) {
        if (expectedMessage != null)
            assert.equal((ex as any).message, expectedMessage);
        return;
    }

    throw new Error("Expected to throw");
}

function run(text: string) {
    const results: { fileName: string; fileText: string; }[] = [];
    const compilerOptions: ts.CompilerOptions = {
        strictNullChecks: true,
        target: ts.ScriptTarget.ES2017
    };
    const transformers: ts.CustomTransformers = {
        before: [transformerFactory],
        after: []
    };
    const testFileName = "/file.ts";
    const host: ts.CompilerHost = {
        fileExists: (fileName: string) => fileName === testFileName,
        readFile: (fileName: string) => fileName === testFileName ? text : undefined,
        getSourceFile: (fileName, languageVersion) => {
            if (fileName !== testFileName)
                return undefined;
            return ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
        },
        getDefaultLibFileName: options => ts.getDefaultLibFileName(options),
        writeFile: () => { throw new Error("Not implemented"); },
        getCurrentDirectory: () => "/",
        getDirectories: () => [],
        getCanonicalFileName: fileName => fileName,
        useCaseSensitiveFileNames: () => true,
        getNewLine: () => "\n"
    };
    const program = ts.createProgram(["/file.ts"], compilerOptions, host);
    program.emit(undefined, (fileName, fileText) => results.push({ fileName, fileText }), undefined, false, transformers);
    return results;
}
