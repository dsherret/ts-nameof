import * as ts from "typescript";

const NAMEOF_NAME = "nameof";
const NAMEOF_FULL_NAME = "full";

export function isNameof(node: ts.Node): node is ts.CallExpression {
    const callExpression = node as ts.CallExpression;
    return callExpression.kind === ts.SyntaxKind.CallExpression
        && callExpression.expression != null
        && isIdentifierWithText(callExpression.expression, NAMEOF_NAME);
}

export function isNameofFull(node: ts.Node): node is ts.CallExpression {
    const callExpression = node as ts.CallExpression;
    return callExpression.kind === ts.SyntaxKind.CallExpression
        && callExpression.expression != null
        && callExpression.expression.kind === ts.SyntaxKind.PropertyAccessExpression
        && isIdentifierWithText((callExpression.expression as ts.PropertyAccessExpression).expression, NAMEOF_NAME)
        && isIdentifierWithText((callExpression.expression as ts.PropertyAccessExpression).name, NAMEOF_FULL_NAME);
}

function isIdentifierWithText(node: ts.Node, text: string) {
    if (node.kind !== ts.SyntaxKind.Identifier)
        return false;
    return (node as ts.Identifier).escapedText === text;
}
