import * as ts from "typescript";
import { throwError } from "./external/common";
import * as common from "./external/transforms-common";
import { isNegativeNumericLiteral, getNegativeNumericLiteralValue, getReturnStatementExpressionFromBlock } from "./helpers";

// todo: the use of the printer seems suspect, but maybe not...
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

/**
 * Parses a TypeScript AST node to a common NameofCallExpression or returns undefined if the current node
 * is not a nameof call expression.
 * @param parsingNode Babel AST node to parse.
 * @param sourceFile Containing source file.
 */
export function parse(parsingNode: ts.Node, sourceFile: ts.SourceFile) {
    return isNameof(parsingNode) ? parseNameof(parsingNode) : undefined;

    function parseNameof(callExpr: ts.CallExpression): common.NameofCallExpression {
        return {
            property: parsePropertyName(callExpr),
            typeArguments: parseTypeArguments(callExpr),
            arguments: parseArguments(callExpr)
        };
    }

    function parsePropertyName(callExpr: ts.CallExpression) {
        const { expression } = callExpr;
        if (!ts.isPropertyAccessExpression(expression) || !ts.isIdentifier(expression.name))
            return undefined;
        return expression.name.text;
    }

    function parseTypeArguments(callExpr: ts.CallExpression) {
        if (callExpr.typeArguments == null)
            return [];
        return callExpr.typeArguments.map(arg => parseCommonNode(arg));
    }

    function parseArguments(callExpr: ts.CallExpression) {
        return callExpr.arguments.map(arg => parseCommonNode(arg));
    }

    function parseCommonNode(node: ts.Expression | ts.TypeNode | ts.EntityName): common.Node {
        if (ts.isPropertyAccessExpression(node))
            return parsePropertyAccessExpression(node);
        if (ts.isElementAccessExpression(node))
            return parseElementAccessExpression(node);
        if (ts.isArrowFunction(node))
            return parseFunctionReturnExpression(node, getArrowFunctionReturnExpression(node));
        if (ts.isFunctionExpression(node))
            return parseFunctionReturnExpression(node, getReturnStatementExpressionFromBlockOrThrow(node.body));
        if (ts.isNonNullExpression(node) || ts.isParenthesizedExpression(node) || ts.isAsExpression(node))
            return parseCommonNode(node.expression);
        if (ts.isQualifiedName(node))
            return parseQualifiedName(node);
        if (ts.isTypeReferenceNode(node))
            return parseCommonNode(node.typeName);
        if (ts.isSpreadElement(node))
            return parseCommonNode(node.expression);
        if (ts.isNumericLiteral(node) || isNegativeNumericLiteral(node))
            return parseNumeric(node);
        if (ts.isStringLiteral(node))
            return parseStringLiteral(node);
        if (ts.isIdentifier(node))
            return parseIdentifier(node);
        if (node.kind === ts.SyntaxKind.ThisKeyword)
            return common.createIdentifierNode("this");
        return throwError(`Unhandled node kind (${node.kind}) in text: ${getNodeText(node)} (Please open an issue if you believe this should be supported.)`);
    }

    function parsePropertyAccessExpression(node: ts.PropertyAccessExpression) {
        const expressionCommonNode = parseCommonNode(node.expression);
        const nameCommonNode = parseIdentifier(node.name);
        getEndCommonNode(expressionCommonNode).next = nameCommonNode;
        return expressionCommonNode;
    }

    function parseElementAccessExpression(node: ts.ElementAccessExpression) {
        const expressionCommonNode = parseCommonNode(node.expression);
        const argumentExpressionCommonNode = parseCommonNode(node.argumentExpression);
        const computedCommonNode = common.createComputedNode(argumentExpressionCommonNode);
        getEndCommonNode(expressionCommonNode).next = computedCommonNode;
        return expressionCommonNode;
    }

    function parseQualifiedName(node: ts.QualifiedName) {
        const leftCommonNode = parseCommonNode(node.left);
        const rightCommonNode = parseCommonNode(node.right);
        getEndCommonNode(leftCommonNode).next = rightCommonNode;
        return leftCommonNode;
    }

    function parseNumeric(node: ts.NumericLiteral | ts.PrefixUnaryExpression) {
        return common.createNumericLiteralNode(getNodeValue());

        function getNodeValue() {
            if (ts.isNumericLiteral(node))
                return parseFloat(node.text);
            return getNegativeNumericLiteralValue(node);
        }
    }

    function parseStringLiteral(node: ts.StringLiteral) {
        return common.createStringLiteralNode(node.text);
    }

    function parseIdentifier(node: ts.Node) {
        const text = getIdentifierTextOrThrow(node);
        return common.createIdentifierNode(text);
    }

    function parseFunctionReturnExpression(functionLikeNode: ts.FunctionLike, node: ts.Expression) {
        const parameterNames = functionLikeNode.parameters.map(p => {
            const name = p.name;
            if (ts.isIdentifier(name))
                return name.text;
            return getNodeText(name);
        });

        return common.createFunctionNode(parseCommonNode(node), parameterNames);
    }

    function getEndCommonNode(commonNode: common.Node) {
        while (commonNode.next != null)
            commonNode = commonNode.next;
        return commonNode;
    }

    function getArrowFunctionReturnExpression(func: ts.ArrowFunction) {
        if (ts.isBlock(func.body))
            return getReturnStatementExpressionFromBlockOrThrow(func.body);
        return func.body;
    }

    function getIdentifierTextOrThrow(node: ts.Node) {
        if (!ts.isIdentifier(node))
            return throwError(`Expected node to be an identifier: ${getNodeText(node)}`);
        return node.text;
    }

    function getReturnStatementExpressionFromBlockOrThrow(block: ts.Block) {
        return getReturnStatementExpressionFromBlock(block)
            || throwError(`Cound not find return statement with an expression in function expression: ${getNodeText(block)}`);
    }

    function getNodeText(node: ts.Node) {
        return printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
    }

    function isNameof(node: ts.Node): node is ts.CallExpression {
        if (!ts.isCallExpression(node))
            return false;

        const identifier = getIdentifierToInspect(node.expression);
        return identifier != null && identifier.text === "nameof";

        function getIdentifierToInspect(expression: ts.LeftHandSideExpression) {
            if (ts.isIdentifier(expression))
                return expression;
            if (ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.expression))
                return expression.expression;
        }
    }
}
