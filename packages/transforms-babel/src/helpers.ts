import * as babelTypes from "@babel/types";
import { Node, BlockStatement, UnaryExpression } from "@babel/types";
import { throwError } from "@ts-nameof/common";

export function isNegativeNumericLiteral(t: typeof babelTypes, node: Node): node is UnaryExpression {
    if (!t.isUnaryExpression(node))
        return false;

    return node.operator === "-" && t.isNumericLiteral(node.argument);
}

export function getNegativeNumericLiteralValue(t: typeof babelTypes, node: UnaryExpression) {
    if (node.operator !== "-" || !t.isNumericLiteral(node.argument))
        return throwError("The passed in UnaryExpression must be for a negative numeric literal.");

    return node.argument.value * -1;
}

export function getReturnStatementArgumentFromBlock(t: typeof babelTypes, block: BlockStatement) {
    for (const statement of block.body) {
        if (t.isReturnStatement(statement) && statement.argument != null)
            return statement.argument;
    }

    return undefined;
}
