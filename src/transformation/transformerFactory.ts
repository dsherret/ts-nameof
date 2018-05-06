import * as ts from "typescript";

const NAMEOF_NAME = "nameof";
const NAMEOF_FULL_NAME = "full";
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
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
            return getLastPart(getArgumentParts(node.arguments[0]));
        else if (node.typeArguments != null && node.typeArguments.length > 0)
            return getLastPart(getTypeArgumentParts(node.typeArguments[0]));
        return undefined;

        function getLastPart(parts: string[]) {
            return parts[parts.length - 1];
        }
    }

    function getNameofFullAsString(node: ts.CallExpression) {
        if (node.arguments != null && node.arguments.length > 0 && !ts.isNumericLiteral(node.arguments[0]))
            return getPartsAsString(getArgumentParts(node.arguments[0]), getCount(node.arguments[1]));
        if (node.typeArguments != null && node.typeArguments.length > 0)
            return getPartsAsString(getTypeArgumentParts(node.typeArguments[0]), getCount(node.arguments == null ? undefined : node.arguments[0]));
        return undefined;

        function getPartsAsString(parts: string[], count: number) {
            return getSubParts().join(".");

            function getSubParts() {
                if (count > 0)
                    return parts.slice(count);
                if (count < 0)
                    return parts.slice(parts.length + count);
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

            return 0;
        }
    }

    function getArgumentParts(arg: ts.Expression) {
        if (ts.isPropertyAccessExpression(arg))
            return getPropertyAccessExpressionParts(arg);
        if (ts.isElementAccessExpression(arg))
            return getElementAccessExpressionParts(arg);
        if (ts.isArrowFunction(arg))
            return getArrowFunctionParts(arg);
        if (ts.isFunctionExpression(arg))
            return getFunctionExpressionParts(arg);

        return [getNodeText(arg)];
    }

    function getTypeArgumentParts(typeArg: ts.TypeNode) {
        if (ts.isQualifiedName(typeArg))
            return getQualifiedNameParts(typeArg);
        return [getNodeText(typeArg)];
    }

    function getFunctionExpressionParts(func: ts.FunctionExpression) {
        return getFunctionParts(getReturnStatementExpression());

        function getReturnStatementExpression() {
            for (const statement of func.body.statements) {
                if (ts.isReturnStatement(statement) && statement.expression != null)
                    return statement.expression;
            }

            return throwError(`Cound not find return statement with an expression in function expression: ${getNodeText(func.body)}`);
        }
    }

    function getArrowFunctionParts(func: ts.ArrowFunction) {
        return getFunctionParts(func.body);
    }

    function getFunctionParts(body: ts.ConciseBody | ts.Expression) {
        if (ts.isPropertyAccessExpression(body))
            return getPropertyAccessExpressionParts(body).slice(1);
        if (ts.isElementAccessExpression(body))
            return getElementAccessExpressionParts(body).slice(1);
        else
            return throwError(`Unexpected function text: ${getNodeText(body)}`);
    }

    function getElementAccessExpressionParts(elementAccessExpr: ts.ElementAccessExpression): string[] {
        if (ts.isElementAccessExpression(elementAccessExpr.expression))
            return addArgTextToArray([...getElementAccessExpressionParts(elementAccessExpr.expression)]);
        if (ts.isPropertyAccessExpression(elementAccessExpr.expression))
            return addArgTextToArray([...getPropertyAccessExpressionParts(elementAccessExpr.expression)]);
        return addArgTextToArray([getNodeText(elementAccessExpr.expression)]);

        function addArgTextToArray(items: string[]) {
            items[items.length - 1] += getArgumentExpression();
            return items;
        }

        function getArgumentExpression() {
            if (elementAccessExpr.argumentExpression == null)
                return "";
            return `[${getNodeText(elementAccessExpr.argumentExpression)}]`;
        }
    }

    function getQualifiedNameParts(name: ts.QualifiedName): string[] {
        if (ts.isQualifiedName(name.left))
            return [...getQualifiedNameParts(name.left), getNodeText(name.right)];
        return [getNodeText(name.left), getNodeText(name.right)];
    }

    function getPropertyAccessExpressionParts(pae: ts.PropertyAccessExpression): string[] {
        if (ts.isPropertyAccessExpression(pae.expression))
            return [...getPropertyAccessExpressionParts(pae.expression), getNodeText(pae.name)];
        return [getNodeText(pae.expression), getNodeText(pae.name)];
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

export { transformerFactory };
