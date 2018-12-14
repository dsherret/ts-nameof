import * as ts from "typescript";
import { throwError } from "../utils";
import { isNameof, isNameofFull } from "./checks";
import { getNumberFromExpression, getReturnStatementExpressionFromBlock } from "./getters";

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

export function visitNode(visitingNode: ts.Node, sourceFile: ts.SourceFile) {
    if (isNameof(visitingNode))
        return createLiteral(getNameofAsString(visitingNode));
    if (isNameofFull(visitingNode))
        return createLiteral(getNameofFullAsString(visitingNode));

    return visitingNode;

    function createLiteral(str: string | undefined) {
        if (str == null || str.trim().length === 0)
            return throwError(`Could not resolve string from expression: ${getNodeText(visitingNode)}`);

        return ts.createLiteral(str);
    }

    function getNameofAsString(callExpr: ts.CallExpression) {
        const expression = getExpression();
        return expression == null ? undefined : getNodeParts(expression).pop();

        function getExpression() {
            if (callExpr.arguments != null && callExpr.arguments.length === 1)
                return callExpr.arguments[0];
            else if (callExpr.typeArguments != null && callExpr.typeArguments.length === 1)
                return callExpr.typeArguments[0];
            return undefined;
        }
    }

    function getNameofFullAsString(callExpr: ts.CallExpression) {
        const exprAndCount = getExpressionAndCount();
        return exprAndCount == null ? undefined : getPartsAsString(getNodeParts(exprAndCount.expression), getCount(exprAndCount.count));

        function getExpressionAndCount() {
            if (callExpr.arguments != null && shouldUseArguments())
                return { expression: callExpr.arguments[0], count: callExpr.arguments[1] };
            if (callExpr.typeArguments != null && callExpr.typeArguments.length > 0)
                return { expression: callExpr.typeArguments[0], count: callExpr.arguments == null ? undefined : callExpr.arguments[0] };
            return undefined;

            function shouldUseArguments() {
                if (callExpr.arguments == null || callExpr.arguments.length === 0)
                    return false;
                if (callExpr.typeArguments == null || callExpr.typeArguments.length === 0)
                    return true;

                return ts.isFunctionLike(callExpr.arguments[0]);
            }
        }

        function getPartsAsString(parts: string[], count: number) {
            return getSubParts().join(".");

            function getSubParts() {
                if (count > 0) {
                    if (count > parts.length - 1)
                        return throwError(`Count of ${count} was larger than max count of ${parts.length - 1} for ${getNodeText(callExpr)}`);
                    return parts.slice(count);
                }
                if (count < 0) {
                    if (Math.abs(count) > parts.length)
                        return throwError(`Count of ${count} was larger than max count of ${parts.length * -1} for ${getNodeText(callExpr)}`);
                    return parts.slice(parts.length + count);
                }
                return parts;
            }
        }

        function getCount(countExpr: ts.Expression | undefined) {
            if (countExpr == null)
                return 0;

            const result = getNumberFromExpression(countExpr);
            if (result == null)
                return throwError(`Expected count to be a number, but was: ${getNodeText(countExpr)}`);
            return result;
        }
    }

    function getNodeParts(node: ts.Expression | ts.TypeNode | ts.EntityName): string[] {
        if (ts.isPropertyAccessExpression(node))
            return getPropertyAccessExpressionParts(node);
        if (ts.isElementAccessExpression(node))
            return getElementAccessExpressionParts(node);
        if (ts.isArrowFunction(node))
            return getArrowFunctionParts(node);
        if (ts.isFunctionExpression(node))
            return getFunctionExpressionParts(node);
        if (ts.isNonNullExpression(node))
            return getNodeParts(node.expression);
        if (ts.isQualifiedName(node))
            return getQualifiedNameParts(node);
        if (ts.isTypeReferenceNode(node))
            return getNodeParts(node.typeName);
        if (ts.isIdentifier(node) || ts.isStringLiteral(node))
            return [node.text];
        return [getNodeText(node)];

        function getFunctionExpressionParts(func: ts.FunctionExpression): string[] {
            return getNodeParts(getReturnStatementExpressionFromBlockOrThrow(func.body)).slice(1);
        }

        function getArrowFunctionParts(func: ts.ArrowFunction): string[] {
            if (ts.isBlock(func.body))
                return getNodeParts(getReturnStatementExpressionFromBlockOrThrow(func.body)).slice(1);
            return getNodeParts(func.body).slice(1);
        }

        function getElementAccessExpressionParts(elementAccessExpr: ts.ElementAccessExpression): string[] {
            return addArgTextToArray(getPartsForKind());

            function getPartsForKind() {
                if (ts.isElementAccessExpression(elementAccessExpr.expression))
                    return [...getElementAccessExpressionParts(elementAccessExpr.expression)];
                if (ts.isPropertyAccessExpression(elementAccessExpr.expression))
                    return [...getPropertyAccessExpressionParts(elementAccessExpr.expression)];
                return [...getNodeParts(elementAccessExpr.expression)];
            }

            function addArgTextToArray(items: string[]) {
                items[items.length - 1] += getArgumentExpression();
                return items;
            }

            function getArgumentExpression() {
                if (elementAccessExpr.argumentExpression == null)
                    return "";
                return `[${getNodeParts(elementAccessExpr.argumentExpression).join(".")}]`;
            }
        }

        function getQualifiedNameParts(name: ts.QualifiedName): string[] {
            if (ts.isQualifiedName(name.left))
                return [...getQualifiedNameParts(name.left), ...getNodeParts(name.right)];
            return [...getNodeParts(name.left), ...getNodeParts(name.right)];
        }

        function getPropertyAccessExpressionParts(pae: ts.PropertyAccessExpression): string[] {
            if (ts.isPropertyAccessExpression(pae.expression))
                return [...getPropertyAccessExpressionParts(pae.expression), ...getNodeParts(pae.name)];
            return [...getNodeParts(pae.expression), ...getNodeParts(pae.name)];
        }

        function getReturnStatementExpressionFromBlockOrThrow(block: ts.Block) {
            return getReturnStatementExpressionFromBlock(block)
                || throwError(`Cound not find return statement with an expression in function expression: ${getNodeText(block)}`);
        }
    }

    function getNodeText(node: ts.Node) {
        return printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
    }
}
