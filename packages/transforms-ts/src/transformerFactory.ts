import { throwError, throwErrorForSourceFile } from "@ts-nameof/common";
import { transformCallExpression } from "@ts-nameof/transforms-common";
import * as ts from "typescript";
import { getNodeText } from "./helpers";
import { parse } from "./parse";
import { transform, TransformResult } from "./transform";
import { VisitSourceFileContext } from "./VisitSourceFileContext";

/** Transformer factory for performing nameof transformations. */
export const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
  return file => visitSourceFile(file, context) as ts.SourceFile;
};

/** Visits all the nodes of the source file. */
export function visitSourceFile(sourceFile: ts.SourceFile, context: ts.TransformationContext) {
  const visitSourceFileContext: VisitSourceFileContext = {
    interpolateExpressions: new Set(),
  };
  try {
    const result = visitNodeAndChildren(sourceFile);

    throwIfContextHasInterpolateExpressions(visitSourceFileContext, sourceFile);

    return result;
  } catch (err: any) {
    return throwErrorForSourceFile(err.message, sourceFile.fileName);
  }

  function visitNodeAndChildren(node: ts.Node): ts.Node {
    if (node == null) {
      return node;
    }

    // visit the children in post order
    node = ts.visitEachChild(node, childNode => visitNodeAndChildren(childNode), context);
    return visitNode(node, sourceFile, visitSourceFileContext);
  }
}

/**
 * Throws if the context contains any remaining interpolate expressions.
 * @param context - Context to check.
 * @param sourceFile - Source file being transformed.
 */
export function throwIfContextHasInterpolateExpressions(context: VisitSourceFileContext, sourceFile: ts.SourceFile) {
  if (context.interpolateExpressions.size > 0) {
    const firstResult = Array.from(context.interpolateExpressions.values())[0];
    return throwError(
      `Found a nameof.interpolate that did not exist within a `
        + `nameof.full call expression: nameof.interpolate(${getNodeText(firstResult, sourceFile)})`,
    );
  }
}

/** Visit a node and do a nameof transformation on it if necessary. */
export function visitNode(visitingNode: ts.Node, sourceFile: ts.SourceFile): TransformResult;
/** @internal */
export function visitNode(visitingNode: ts.Node, sourceFile: ts.SourceFile, context: VisitSourceFileContext | undefined): TransformResult;
export function visitNode(visitingNode: ts.Node, sourceFile: ts.SourceFile, context?: VisitSourceFileContext) {
  const parseResult = parse(visitingNode, sourceFile, context);
  if (parseResult == null) {
    return visitingNode;
  }
  return transform(transformCallExpression(parseResult), context);
}
