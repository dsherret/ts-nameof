import * as ts from "typescript";
import { visitNode } from "./visitNode";

export const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
    return file => visitSourceFile(file, context) as ts.SourceFile;
};

export function visitSourceFile(sourceFile: ts.SourceFile, context: ts.TransformationContext) {
    return visitNodeAndChildren(sourceFile);

    function visitNodeAndChildren(node: ts.Node): ts.Node {
        if (node == null)
            return node;

        node = visitNode(node, sourceFile);

        return ts.visitEachChild(node, childNode => visitNodeAndChildren(childNode), context);
    }
}
