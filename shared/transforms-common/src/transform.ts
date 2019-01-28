import { throwError } from "./external/common";
import { NameofCallExpression, Node } from "./nodes";
import { printCallExpression, printNode } from "./printers";

export function transform(callExpr: NameofCallExpression) {
    if (callExpr.property == null)
        return handleNameof(callExpr);
    if (callExpr.property === "full")
        return handleNameofFull(callExpr);
    return undefined;
}

function handleNameof(callExpr: NameofCallExpression) {
    const expression = getExpression();
    return expression == null ? undefined : getNodePartAsStringArray(expression, undefined).pop();

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
    return exprAndCount == null ? undefined : getPartsAsString(getNodePartAsStringArray(exprAndCount.expression, undefined), getCount(exprAndCount.count));

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

function getNodePartAsStringArray(nodePart: Node | undefined, parent: Node | undefined) {
    const result: string[] = [];

    while (nodePart != null) {
        if (nodePart.kind === "Computed") {
            const text = `[${getNodePartAsStringArray(nodePart.value, nodePart).join(".")}]`;
            if (result.length === 0)
                result.push(text);
            else
                result[result.length - 1] += text;
        }
        else if (nodePart.kind === "Function") {
            if (parent != null)
                return throwError(`Nesting functions is not supported: ${printNode(nodePart)}`);
            // skip over the first part
            const firstPart = nodePart.value;
            if (firstPart.next == null)
                return throwError(`A property must be accessed on the object: ${printNode(nodePart)}`);
            if (firstPart.next.kind === "Computed")
                return throwError(`First accessed property must not be computed: ${printNode(nodePart)}`);
            result.push(...getNodePartAsStringArray(firstPart.next, undefined));
        }
        else if (nodePart.kind === "StringLiteral" && parent != null && parent.kind === "Computed" && result.length === 0)
            result.push(`"${nodePart.value}"`);
        else
            result.push(nodePart.value.toString());

        nodePart = nodePart.next;
    }

    return result;
}
