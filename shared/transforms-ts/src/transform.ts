import * as ts from "typescript";
import { throwError } from "./external/common";
import * as common from "./external/transforms-common";

/**
 * Transforms a common node to a TypeScript compiler node.
 * @param node Common node to be transformed.
 */
export function transform(node: common.Node) {
    switch (node.kind) {
        case "StringLiteral":
            return ts.createLiteral(node.value);
        case "ArrayLiteral":
            return throwError("Not implemented transform: ArrayLiteral.");
        default:
            return throwError(`Unsupported node kind: ${node.kind}`);
    }
}
