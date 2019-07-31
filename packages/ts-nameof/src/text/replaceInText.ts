import * as ts from "typescript";
import { visitNode } from "../external/transforms-ts";

const printer = ts.createPrinter();

export function replaceInText(fileName: string, fileText: string): { fileText?: string; replaced: boolean; } {
    // unofficial pre-2.0 backwards compatibility for this method
    if (arguments.length === 1) {
        fileText = fileName;
        fileName = "/file.tsx"; // assume tsx
    }

    const sourceFile = ts.createSourceFile(fileName, fileText, ts.ScriptTarget.Latest, false);
    const transformations: { start: number; end: number; text: string; }[] = [];
    const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
        // this will always use the source file above
        return _ => visitSourceFile(context);
    };
    ts.transform(sourceFile, [transformerFactory]);

    if (transformations.length === 0)
        return { replaced: false };

    return { fileText: getTransformedText(), replaced: true };

    function getTransformedText() {
        let finalText = "";
        let lastPos = 0;

        for (const transform of transformations) {
            finalText += fileText.substring(lastPos, transform.start);
            finalText += transform.text;
            lastPos = transform.end;
        }

        finalText += fileText.substring(lastPos);
        return finalText;
    }

    function visitSourceFile(context: ts.TransformationContext) {
        return visitNodeAndChildren(sourceFile) as ts.SourceFile;

        function visitNodeAndChildren(node: ts.Node): ts.Node {
            if (node == null)
                return node;

            node = ts.visitEachChild(node, childNode => visitNodeAndChildren(childNode), context);

            const resultNode = visitNode(node, sourceFile);
            const wasTransformed = resultNode !== node;

            if (wasTransformed)
                storeTransformation();

            return resultNode;

            function storeTransformation() {
                const nodeStart = node.getStart(sourceFile);
                const lastTransformation = transformations[transformations.length - 1];

                // remove the last transformation if it's nested within this transformation
                if (lastTransformation != null && lastTransformation.start > nodeStart)
                    transformations.pop();

                transformations.push({
                    start: nodeStart,
                    end: node.end,
                    text: printer.printNode(ts.EmitHint.Unspecified, resultNode, sourceFile)
                });
            }
        }
    }
}
