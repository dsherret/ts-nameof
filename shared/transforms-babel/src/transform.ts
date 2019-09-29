import * as babelTypes from "@babel/types";
import { throwError } from "./external/common";
import * as common from "./external/transforms-common";

/**
 * Transforms a common node to a Babel node.
 * @param node Common node to be transformed.
 */
export function transform(t: typeof babelTypes, node: common.Node): babelTypes.StringLiteral | babelTypes.ArrayExpression | babelTypes.TemplateLiteral {
    switch (node.kind) {
        case "StringLiteral":
            return t.stringLiteral(node.value);
        case "ArrayLiteral":
            return t.arrayExpression(node.elements.map(element => transform(t, element)));
        case "TemplateExpression":
            return createTemplateLiteral(t, node);
        default:
            return throwError(`Unsupported node kind: ${node.kind}`);
    }
}

function createTemplateLiteral(t: typeof babelTypes, node: common.TemplateExpressionNode) {
    const quasis: babelTypes.TemplateElement[] = [];
    const expressions: babelTypes.Expression[] = [];

    for (const part of node.parts) {
        if (typeof part === "string")
            quasis.push(t.templateElement({ raw: part }));
        else {
            const expr = part.expression as babelTypes.Expression;
            expressions.push(expr);
        }
    }

    // set the last quasi as the tail
    quasis[quasis.length - 1].tail = true;

    return t.templateLiteral(quasis, expressions);
}
