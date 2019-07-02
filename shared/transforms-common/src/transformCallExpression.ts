import { throwError } from "./external/common";
import { NameofCallExpression, Node } from "./nodes";
import { createStringLiteralNode, createArrayLiteralNode } from "./node-factories";
import { printCallExpression, printNode } from "./printers";
import { getLastNodePartText, getNodePartTexts } from "./getNodePartTexts";

export function transformCallExpression(callExpr: NameofCallExpression) {
    if (callExpr.property == null)
        return createStringLiteralNode(handleNameof(callExpr));
    if (callExpr.property === "full")
        return createStringLiteralNode(handleNameofFull(callExpr));
    if (callExpr.property === "toArray")
        return createArrayLiteralNode(handleNameofToArray(callExpr));
    return throwError(`Unsupported nameof call expression with property '${callExpr.property}': ${printCallExpression(callExpr)}`);
}

function handleNameof(callExpr: NameofCallExpression) {
    return getLastNodePartText(getExpression());

    function getExpression() {
        if (callExpr.arguments.length === 1)
            return callExpr.arguments[0];
        else if (callExpr.typeArguments.length === 1)
            return callExpr.typeArguments[0];
        return throwError(`Call expression must have one argument or type argument: ${printCallExpression(callExpr)}`);
    }
}

function handleNameofFull(callExpr: NameofCallExpression) {
    const exprAndCount = getExpressionAndCount();
    return getPartsAsString(getNodePartTexts(exprAndCount.expression), getCount(exprAndCount.count));

    function getExpressionAndCount() {
        if (shouldUseArguments())
            return { expression: callExpr.arguments[0], count: callExpr.arguments.length > 1 ? callExpr.arguments[1] : undefined };
        if (callExpr.typeArguments.length > 0)
            return { expression: callExpr.typeArguments[0], count: callExpr.arguments.length > 0 ? callExpr.arguments[0] : undefined };
        return throwError(`Unsupported use of nameof.full: ${printCallExpression(callExpr)}`);

        function shouldUseArguments() {
            if (callExpr.arguments.length === 0)
                return false;
            if (callExpr.typeArguments.length === 0)
                return true;

            return callExpr.arguments[0].kind === "Function";
        }
    }

    function getPartsAsString(parts: string[], count: number) {
        return getSubParts().join(".");

        function getSubParts() {
            if (count > 0) {
                if (count > parts.length - 1)
                    return throwError(`Count of ${count} was larger than max count of ${parts.length - 1}: ${printCallExpression(callExpr)}`);
                return parts.slice(count);
            }
            if (count < 0) {
                if (Math.abs(count) > parts.length)
                    return throwError(`Count of ${count} was larger than max count of ${parts.length * -1}: ${printCallExpression(callExpr)}`);
                return parts.slice(parts.length + count);
            }
            return parts;
        }
    }

    function getCount(countExpr: Node | undefined) {
        if (countExpr == null)
            return 0;

        if (countExpr.kind !== "NumericLiteral")
            return throwError(`Expected count to be a number, but was: ${printNode(countExpr)}`);

        return countExpr.value;
    }
}

function handleNameofToArray(callExpr: NameofCallExpression) {
    const arrayArguments = getNodeArray();
    return arrayArguments.map(element => convertToStringLiteralNode(element));

    function getNodeArray() {
        if (callExpr.arguments.length === 0)
            return throwError(`Unable to parse call expression, no arguments provided: ${printCallExpression(callExpr)}`);

        const firstArgument = callExpr.arguments[0];
        if (callExpr.arguments.length === 1 && firstArgument.kind === "Function") {
            const functionReturnValue = firstArgument.value;

            if (functionReturnValue == null || functionReturnValue.kind !== "ArrayLiteral")
                return throwError(`Unsupported toArray call expression, an array must be returned by the provided function: ${printCallExpression(callExpr)}`);

            return functionReturnValue.elements;
        }
        else {
            return callExpr.arguments;
        }
    }

    function convertToStringLiteralNode(element: Node) {
        const stringElement = getLastNodePartText(element);
        return createStringLiteralNode(stringElement);
    }
}
