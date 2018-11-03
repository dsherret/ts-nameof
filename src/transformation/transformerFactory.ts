import * as ts from "typescript";

const NAMEOF_NAME = "nameof";
const NAMEOF_FULL_NAME = "full";
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

export const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
    return file => visitSourceFile(file, context) as ts.SourceFile;
};

function visitSourceFile(sourceFile: ts.SourceFile, context: ts.TransformationContext) {
    return visitNodeAndChildren(sourceFile);

    function visitNodeAndChildren(node: ts.Node): ts.Node {
        if (node == null)
            return node;

        node = visitNode(node);

        return ts.visitEachChild(node, childNode => visitNodeAndChildren(childNode), context);
    }

    function visitNode(node: ts.Node) {
        if (isNameof(node))
            return getLiteral(getNameofAsString(node));
        if (isNameofFull(node))
            return getLiteral(getNameofFullAsString(node));
        return node;

        function getLiteral(str: string | undefined) {
            if (str == null || str.trim().length === 0)
                return throwError(`Could not resolve string from expression: ${getNodeText(node)}`);

            return ts.createLiteral(str);
        }
    }

    function getNameofAsString(node: ts.CallExpression) {
        if (node.arguments != null && node.arguments.length > 0)
            return getLastPart(getNodeParts(node.arguments[0]));
        else if (node.typeArguments != null && node.typeArguments.length > 0)
            return getLastPart(getNodeParts(node.typeArguments[0]));
        return undefined;

        function getLastPart(parts: string[]) {
            return parts[parts.length - 1];
        }
    }

    function getNameofFullAsString(node: ts.CallExpression) {
        if (node.arguments != null && shouldUseArguments())
            return getPartsAsString(getNodeParts(node.arguments[0]), getCount(node.arguments[1]));
        if (node.typeArguments != null && node.typeArguments.length > 0)
            return getPartsAsString(getNodeParts(node.typeArguments[0]), getCount(node.arguments == null ? undefined : node.arguments[0]));
        return undefined;

        function getPartsAsString(parts: string[], count: number) {
            return getSubParts().join(".");

            function getSubParts() {
                if (count > 0) {
                    if (count > parts.length - 1)
                        return throwError(`Count of ${count} was larger than max count of ${parts.length - 1} for ${getNodeText(node)}`);
                    return parts.slice(count);
                }
                if (count < 0) {
                    if (Math.abs(count) > parts.length)
                        return throwError(`Count of ${count} was larger than max count of ${parts.length * -1} for ${getNodeText(node)}`);
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
            if (node.arguments == null || node.arguments.length === 0)
                return false;
            if (node.typeArguments == null || node.typeArguments.length === 0)
                return true;

            return ts.isFunctionLike(node.arguments[0]);
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

    function isNameof(node: ts.Node): node is ts.CallExpression {
        const callExpression = node as ts.CallExpression;
        return callExpression.kind === ts.SyntaxKind.CallExpression
            && callExpression.expression != null
            && isIdentifierWithText(callExpression.expression, NAMEOF_NAME);
    }

    function isNameofFull(node: ts.Node): node is ts.CallExpression {
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

    function throwError(message: string): never {
        throw new Error(`[ts-nameof]: ${message}`);
    }

    function getNodeText(node: ts.Node) {
        return printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
    }
}
