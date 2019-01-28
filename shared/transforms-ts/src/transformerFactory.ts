import * as ts from "typescript";
import { transformCallExpression } from "./external/transforms-common";
import { parse } from "./parse";
import { transform } from "./transform";

export const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
    return file => visitSourceFile(file, context) as ts.SourceFile;
};

export function visitSourceFile(sourceFile: ts.SourceFile, context: ts.TransformationContext) {
    return visitNodeAndChildren(sourceFile);

    function visitNodeAndChildren(node: ts.Node): ts.Node {
        if (node == null)
            return node;

        // visit the children in post order
        node = ts.visitEachChild(node, childNode => visitNodeAndChildren(childNode), context);
        return visitNode(node, sourceFile);
    }
}

export function visitNode(visitingNode: ts.Node, sourceFile: ts.SourceFile) {
    const parseResult = parse(visitingNode, sourceFile);
    if (parseResult == null)
        return visitingNode;
    return transform(transformCallExpression(parseResult));
}
