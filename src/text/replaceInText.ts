import * as ts from "typescript";
import { visitNode } from "../transformation";

export function replaceInText(fileName: string, fileText: string): { fileText?: string; replaced: boolean; } {
    // unofficial pre-2.0 backwards compatibility for this method
    if (arguments.length === 1) {
        fileText = fileName;
        fileName = "/file.tsx"; // assume tsx
    }

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
        const wasTransformed = result !== node;

        if (!wasTransformed) {
            ts.forEachChild(node, forEachChild);
            return;
        }

        finalText += fileText.substring(lastPos, node.getStart(sourceFile));
        finalText += `"${(result as ts.StringLiteral).text}"`;
        lastPos = node.getEnd();
    }
}
