import * as ts from "typescript";

export function getNumberFromExpression(expr: ts.Expression) {
    // negative
    if (ts.isPrefixUnaryExpression(expr)) {
        const { operator, operand } = expr;
        if (operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(operand)) {
            const result = parseInt(operand.text, 10);
            if (!isNaN(result))
                return result * -1;
        }
    }

    // positive
    if (ts.isNumericLiteral(expr)) {
        const result = parseInt(expr.text, 10);
        if (!isNaN(result))
            return result;
    }

    return undefined;
}

export function getReturnStatementExpressionFromBlock(block: ts.Block) {
    for (const statement of block.statements) {
        if (ts.isReturnStatement(statement) && statement.expression != null)
            return statement.expression;
    }

    return undefined;
}
