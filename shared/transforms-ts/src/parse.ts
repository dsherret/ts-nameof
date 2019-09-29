import * as ts from "typescript";
import { throwError, assertNever } from "./external/common";
import * as common from "./external/transforms-common";
import { isNegativeNumericLiteral, getNegativeNumericLiteralValue, getReturnStatementExpressionFromBlock, getNodeText } from "./helpers";
import { InterpolateNode, createInterpolateNode } from "./external/transforms-common";
import { VisitSourceFileContext } from "./VisitSourceFileContext";

/**
 * Parses a TypeScript AST node to a common NameofCallExpression or returns undefined if the current node
 * is not a nameof call expression.
 * @param parsingNode - Babel AST node to parse.
 * @param sourceFile - Containing source file.
 * @param context - Context for when visiting all the source file nodes
 */
export function parse(parsingNode: ts.Node, sourceFile: ts.SourceFile, context: VisitSourceFileContext | undefined) {
    if (!isNameof(parsingNode))
        return undefined;

    const propertyName = parsePropertyName(parsingNode);

    // Ignore nameof.interpolate function calls... they will be dealt with later.
    if (isInterpolatePropertyName(propertyName)) {
        handleNameofInterpolate(parsingNode);
        return undefined;
    }

    return parseNameof(parsingNode);

    function parseNameof(callExpr: ts.CallExpression): common.NameofCallExpression {
        return {
            property: propertyName,
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
        if (ts.isArrayLiteralExpression(node))
            return parseArrayLiteralExpression(node);
        if (ts.isIdentifier(node))
            return parseIdentifier(node);
        if (ts.isImportTypeNode(node))
            return parseImportType(node);
        if (ts.isLiteralTypeNode(node))
            return parseCommonNode(node.literal); // skip over and go straight to the literal
        if (node.kind === ts.SyntaxKind.ThisKeyword)
            return common.createIdentifierNode("this");
        if (node.kind === ts.SyntaxKind.SuperKeyword)
            return common.createIdentifierNode("super");
        if (ts.isNoSubstitutionTemplateLiteral(node))
            return common.createTemplateExpressionNode([node.text]);
        if (ts.isTemplateExpression(node))
            return parseTemplateExpression(node);
        if (isNameof(node) && isInterpolatePropertyName(parsePropertyName(node)))
            return parseInterpolateNode(node);
        return throwError(`Unhandled node kind (${node.kind}) in text: ${getNodeText(node, sourceFile)}`
            + ` (Please open an issue if you believe this should be supported.)`);
    }

    function parseArrayLiteralExpression(node: ts.ArrayLiteralExpression) {
        const elements = node.elements.map(element => parseCommonNode(element));
        return common.createArrayLiteralNode(elements);
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
            return getNodeText(name, sourceFile);
        });

        return common.createFunctionNode(parseCommonNode(node), parameterNames);
    }

    function parseImportType(node: ts.ImportTypeNode) {
        const importType = common.createImportTypeNode(node.isTypeOf || false, node.argument && parseCommonNode(node.argument));
        const qualifier = node.qualifier && parseCommonNode(node.qualifier);
        getEndCommonNode(importType).next = qualifier;
        return importType;
    }

    function parseTemplateExpression(node: ts.TemplateExpression) {
        return common.createTemplateExpressionNode(getParts());

        function getParts() {
            const parts: (string | InterpolateNode)[] = [];
            if (node.head.text.length > 0)
                parts.push(node.head.text);
            for (const templateSpan of node.templateSpans) {
                if (ts.isTemplateHead(templateSpan))
                    parts.push(templateSpan.text);
                else if (ts.isTemplateSpan(templateSpan)) {
                    parts.push(createInterpolateNode(templateSpan.expression, getNodeText(templateSpan.expression, sourceFile)));
                    parts.push(templateSpan.literal.text);
                }
                else {
                    return assertNever(templateSpan, "Not implemented scenario.");
                }
            }
            return parts;
        }
    }

    function parseInterpolateNode(node: ts.CallExpression) {
        if (node.arguments.length !== 1)
            return throwError(`Should never happen as this would have been tested for earlier.`);
        return common.createInterpolateNode(node.arguments[0], getNodeText(node.arguments[0], sourceFile));
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
            return throwError(`Expected node to be an identifier: ${getNodeText(node, sourceFile)}`);
        return node.text;
    }

    function getReturnStatementExpressionFromBlockOrThrow(block: ts.Block) {
        return getReturnStatementExpressionFromBlock(block)
            || throwError(`Cound not find return statement with an expression in function expression: ${getNodeText(block, sourceFile)}`);
    }

    function handleNameofInterpolate(callExpr: ts.CallExpression) {
        if (callExpr.arguments.length !== 1)
            return throwError("Unexpected scenario where a nameof.interpolate function did not have a single argument.");

        // Add the interpolate expression to the context so that it can be checked later to find
        // nameof.interpolate calls that were never resolved.
        if (context != null)
            context.interpolateExpressions.add(callExpr.arguments[0]);
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

    function isInterpolatePropertyName(propertyName: string | undefined) {
        return propertyName === "interpolate";
    }
}
