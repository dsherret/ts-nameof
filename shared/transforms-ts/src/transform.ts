import * as ts from "typescript";
import { throwError } from "./external/common";
import * as common from "./external/transforms-common";

/**
 * Transforms a common node to a TypeScript compiler node.
 * @param node Common node to be transformed.
 */
export function transform(node: common.Node): ts.StringLiteral | ts.ArrayLiteralExpression {
    switch (node.kind) {
        case "StringLiteral":
            return ts.createLiteral(node.value);
        case "ArrayLiteral":
            return ts.createArrayLiteral(node.elements.map(element => transform(element)));
        default:
            return throwError(`Unsupported node kind: ${node.kind}`);
    }
}
