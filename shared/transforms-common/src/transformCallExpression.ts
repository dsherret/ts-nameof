import { throwError } from "./external/common";
import { NameofCallExpression, Node } from "./nodes";
import { createStringLiteralNode } from "./node-factories";
import { printCallExpression, printNode } from "./printers";
import { getLastNodePartText, getNodePartTexts } from "./getNodePartTexts";

export function transformCallExpression(callExpr: NameofCallExpression) {
    if (callExpr.property == null)
        return createStringLiteralNodeOrThrow(handleNameof(callExpr));
    if (callExpr.property === "full")
        return createStringLiteralNodeOrThrow(handleNameofFull(callExpr));
    return throwForUnsupportedCallExpression();

    function createStringLiteralNodeOrThrow(value: string | undefined) {
        return value == null ? throwForUnsupportedCallExpression() : createStringLiteralNode(value);
    }

    function throwForUnsupportedCallExpression() {
        return throwError(`Unsupported nameof call expression: ${printCallExpression(callExpr)}`);
    }
}

function handleNameof(callExpr: NameofCallExpression) {
    const expression = getExpression();
    return expression == null ? undefined : getLastNodePartText(expression);

    function getExpression() {
        if (callExpr.arguments.length === 1)
            return callExpr.arguments[0];
        else if (callExpr.typeArguments.length === 1)
            return callExpr.typeArguments[0];
        return undefined;
    }
}

function handleNameofFull(callExpr: NameofCallExpression) {
    const exprAndCount = getExpressionAndCount();
    return exprAndCount == null ? undefined : getPartsAsString(getNodePartTexts(exprAndCount.expression), getCount(exprAndCount.count));

    function getExpressionAndCount() {
        if (shouldUseArguments())
            return { expression: callExpr.arguments[0], count: callExpr.arguments.length > 1 ? callExpr.arguments[1] : undefined };
        if (callExpr.typeArguments.length > 0)
            return { expression: callExpr.typeArguments[0], count: callExpr.arguments.length > 0 ? callExpr.arguments[0] : undefined };
        return undefined;

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
                    return throwError(`Count of ${count} was larger than max count of ${parts.length - 1} for ${printCallExpression(callExpr)}`);
                return parts.slice(count);
            }
            if (count < 0) {
                if (Math.abs(count) > parts.length)
                    return throwError(`Count of ${count} was larger than max count of ${parts.length * -1} for ${printCallExpression(callExpr)}`);
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
