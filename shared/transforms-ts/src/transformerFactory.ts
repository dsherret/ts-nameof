import * as ts from "typescript";
import { transformCallExpression } from "./external/transforms-common";
import { getNodeText } from "./helpers";
import { parse } from "./parse";
import { transform, TransformResult } from "./transform";
import { VisitSourceFileContext } from "./VisitSourceFileContext";
import { throwError } from "./external/transforms-common/external/common";

/** Transformer factory for performing nameof transformations. */
export const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
    return file => visitSourceFile(file, context) as ts.SourceFile;
};

/** Visits all the nodes of the source file. */
export function visitSourceFile(sourceFile: ts.SourceFile, context: ts.TransformationContext) {
    const visitSourceFileContext: VisitSourceFileContext = {
        interpolateExpressions: new Set()
    };
    const result = visitNodeAndChildren(sourceFile);

    if (visitSourceFileContext.interpolateExpressions.size > 0) {
        const firstResult = Array.from(visitSourceFileContext.interpolateExpressions.values())[0];
        return throwError(`Found a nameof.interpolate that did not exist within a `
            + `nameof.full call expression: nameof.interpolate(${getNodeText(firstResult, sourceFile)})`);
    }

    return result;

    function visitNodeAndChildren(node: ts.Node): ts.Node {
        if (node == null)
            return node;

        // visit the children in post order
        node = ts.visitEachChild(node, childNode => visitNodeAndChildren(childNode), context);
        return visitNode(node, sourceFile, visitSourceFileContext);
    }
}

/** Visit a node and do a nameof transformation on it if necessary. */
export function visitNode(visitingNode: ts.Node, sourceFile: ts.SourceFile): TransformResult;
/** @internal */
export function visitNode(visitingNode: ts.Node, sourceFile: ts.SourceFile, context: VisitSourceFileContext | undefined): TransformResult;
export function visitNode(visitingNode: ts.Node, sourceFile: ts.SourceFile, context?: VisitSourceFileContext) {
    const parseResult = parse(visitingNode, sourceFile, context);
    if (parseResult == null)
        return visitingNode;
    return transform(transformCallExpression(parseResult), context);
}
