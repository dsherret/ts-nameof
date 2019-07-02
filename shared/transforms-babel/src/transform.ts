import * as babelTypes from "@babel/types";
import { throwError } from "./external/common";
import * as common from "./external/transforms-common";

/**
 * Transforms a common node to a Babel node.
 * @param node Common node to be transformed.
 */
export function transform(t: typeof babelTypes, node: common.Node): babelTypes.StringLiteral | babelTypes.ArrayExpression {
    switch (node.kind) {
        case "StringLiteral":
            return t.stringLiteral(node.value);
        case "ArrayLiteral":
            return t.arrayExpression(node.elements.map(element => transform(t, element)));
        default:
            return throwError(`Unsupported node kind: ${node.kind}`);
    }
}
