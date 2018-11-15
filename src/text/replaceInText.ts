import * as ts from "typescript";
import { visitNode } from "../transformation";

export function replaceInText(fileText: string, isTsxFile: boolean): { fileText?: string; replaced: boolean; } {
    const sourceFile = ts.createSourceFile(isTsxFile ? "file.tsx" : "file.ts", fileText, ts.ScriptTarget.Latest, false,
        isTsxFile ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
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
