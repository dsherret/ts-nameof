import * as ts from "typescript";
import { visitNode } from "../transformation";
import { throwError } from "../utils";

export function replaceInText(fileName: string, fileText: string): { fileText?: string; replaced: boolean; } {
    if (arguments.length !== 2)
        throwError("replaceInText expects two arguments—a file name and file text.");

    const sourceFile = ts.createSourceFile(fileName, fileText, ts.ScriptTarget.Latest, false);
    let finalText = "";
    let lastPos = 0;

    forEachChild(sourceFile);

    if (lastPos === 0)
        return { replaced: false };

    finalText += fileText.substring(lastPos);

    return { fileText: finalText, replaced: true };

    function forEachChild(node: ts.Node) {
        const result = visitNode(node, sourceFile);
        if (result === node) {
            ts.forEachChild(node, forEachChild);
            return;
        }

        finalText += fileText.substring(lastPos, node.getStart(sourceFile));
        finalText += `"${(result as ts.Identifier).text}"`;
        lastPos = node.getEnd();
    }
}
