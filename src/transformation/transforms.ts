import * as ts from "typescript";
import { throwError } from "./common";
import { isNameof, isNameofFull } from "./checks";

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

export function visitNode(visitingNode: ts.Node, sourceFile: ts.SourceFile) {
    if (isNameof(visitingNode))
        return getLiteral(getNameofAsString(visitingNode));
    if (isNameofFull(visitingNode))
        return getLiteral(getNameofFullAsString(visitingNode));

    return visitingNode;

    function getLiteral(str: string | undefined) {
        if (str == null || str.trim().length === 0)
            return throwError(`Could not resolve string from expression: ${getNodeText(visitingNode)}`);

        return ts.createLiteral(str);
    }

    function getNameofAsString(callExpr: ts.CallExpression) {
        if (callExpr.arguments != null && callExpr.arguments.length > 0)
            return getLastPart(getNodeParts(callExpr.arguments[0]));
        else if (callExpr.typeArguments != null && callExpr.typeArguments.length > 0)
            return getLastPart(getNodeParts(callExpr.typeArguments[0]));
        return undefined;

        function getLastPart(parts: string[]) {
            return parts[parts.length - 1];
        }
    }

    function getNameofFullAsString(callExpr: ts.CallExpression) {
        if (callExpr.arguments != null && shouldUseArguments())
            return getPartsAsString(getNodeParts(callExpr.arguments[0]), getCount(callExpr.arguments[1]));
        if (callExpr.typeArguments != null && callExpr.typeArguments.length > 0)
            return getPartsAsString(getNodeParts(callExpr.typeArguments[0]), getCount(callExpr.arguments == null ? undefined : callExpr.arguments[0]));
        return undefined;

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
            if (ts.isNumericLiteral(countExpr) || ts.isPrefixUnaryExpression(countExpr)) {
                const result = parseInt(getNodeText(countExpr), 10);
                if (!isNaN(result))
                    return result;
            }

            return throwError(`Expected count to be a number, but was: ${getNodeText(countExpr)}`);
        }

        function shouldUseArguments() {
            if (callExpr.arguments == null || callExpr.arguments.length === 0)
                return false;
            if (callExpr.typeArguments == null || callExpr.typeArguments.length === 0)
                return true;

            return ts.isFunctionLike(callExpr.arguments[0]);
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
        return [getNodeText(node)];
    }

    function getFunctionExpressionParts(func: ts.FunctionExpression): string[] {
        return getNodeParts(getReturnStatementExpressionFromBlock(func.body)).slice(1);
    }

    function getArrowFunctionParts(func: ts.ArrowFunction): string[] {
        if (ts.isBlock(func.body))
            return getNodeParts(getReturnStatementExpressionFromBlock(func.body)).slice(1);
        return getNodeParts(func.body).slice(1);
    }

    function getReturnStatementExpressionFromBlock(block: ts.Block) {
        for (const statement of block.statements) {
            if (ts.isReturnStatement(statement) && statement.expression != null)
                return statement.expression;
        }

        return throwError(`Cound not find return statement with an expression in function expression: ${getNodeText(block)}`);
    }

    function getElementAccessExpressionParts(elementAccessExpr: ts.ElementAccessExpression): string[] {
        if (ts.isElementAccessExpression(elementAccessExpr.expression))
            return addArgTextToArray([...getElementAccessExpressionParts(elementAccessExpr.expression)]);
        if (ts.isPropertyAccessExpression(elementAccessExpr.expression))
            return addArgTextToArray([...getPropertyAccessExpressionParts(elementAccessExpr.expression)]);
        return addArgTextToArray([...getNodeParts(elementAccessExpr.expression)]);

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

    function getNodeText(node: ts.Node) {
        return printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
    }
}
