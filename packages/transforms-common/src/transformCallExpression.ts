import { throwError, assertNever } from "@ts-nameof/common";
import { NameofCallExpression, Node, StringLiteralNode, TemplateExpressionNode, FunctionNode } from "./nodes";
import { createStringLiteralNode, createArrayLiteralNode, createTemplateExpressionNode } from "./nodeFactories";
import { printCallExpression, printNode } from "./printers";
import { flattenNodeToArray, getLastNextNode } from "./nodeHelpers";
import { StringOrTemplateExpressionNodeBuilder } from "./StringOrTemplateExpressionBuilder";

export function transformCallExpression(callExpr: NameofCallExpression) {
    if (callExpr.property == null)
        return handleNameof(callExpr);
    if (callExpr.property === "full")
        return handleNameofFull(callExpr);
    if (callExpr.property === "toArray")
        return handleNameofToArray(callExpr);
    return throwError(`Unsupported nameof call expression with property '${callExpr.property}': ${printCallExpression(callExpr)}`);
}

function handleNameof(callExpr: NameofCallExpression) {
    return parseNameofExpression(getExpression());

    function getExpression() {
        if (callExpr.arguments.length === 1)
            return callExpr.arguments[0];
        else if (callExpr.typeArguments.length === 1)
            return callExpr.typeArguments[0];
        return throwError(`Call expression must have one argument or type argument: ${printCallExpression(callExpr)}`);
    }
}

function handleNameofFull(callExpr: NameofCallExpression) {
    const { expression, count } = getExpressionAndCount();
    return parseNameofFullExpression(getNodesFromCount(flattenNodeToArray(expression), count));

    function getExpressionAndCount() {
        if (shouldUseArguments()) {
            return {
                expression: getArgumentExpression(),
                count: getCountFromNode(callExpr.arguments.length > 1 ? callExpr.arguments[1] : undefined)
            };
        }
        if (callExpr.typeArguments.length > 0) {
            return {
                expression: callExpr.typeArguments[0],
                count: getCountFromNode(callExpr.arguments.length > 0 ? callExpr.arguments[0] : undefined)
            };
        }

        return throwError(`Unsupported use of nameof.full: ${printCallExpression(callExpr)}`);

        function shouldUseArguments() {
            if (callExpr.arguments.length === 0)
                return false;
            if (callExpr.typeArguments.length === 0)
                return true;

            return callExpr.arguments[0].kind === "Function";
        }

        function getArgumentExpression() {
            let expression = callExpr.arguments[0];
            if (expression.kind === "Function") {
                expression = expression.value;
                // skip over the first identifier (ex. skip over `obj` in `obj => obj.test`)
                if (expression.next == null)
                    return throwError(`A property must be accessed on the object: ${printNode(callExpr.arguments[0])}`);
                expression = expression.next;
            }
            return expression;
        }

        function getCountFromNode(countExpr: Node | undefined) {
            if (countExpr == null)
                return 0;

            if (countExpr.kind !== "NumericLiteral")
                return throwError(`Expected count to be a number, but was: ${printNode(countExpr)}`);

            return countExpr.value;
        }
    }

    function getNodesFromCount(nodes: Node[], count: number) {
        if (count > 0) {
            if (count > nodes.length - 1)
                return throwError(`Count of ${count} was larger than max count of ${nodes.length - 1}: ${printCallExpression(callExpr)}`);
            return nodes.slice(count);
        }
        if (count < 0) {
            if (Math.abs(count) > nodes.length)
                return throwError(`Count of ${count} was larger than max count of ${nodes.length * -1}: ${printCallExpression(callExpr)}`);
            return nodes.slice(nodes.length + count);
        }
        return nodes;
    }
}

function handleNameofToArray(callExpr: NameofCallExpression) {
    const arrayArguments = getNodeArray();
    return createArrayLiteralNode(arrayArguments.map(element => parseNameofExpression(element)));

    function getNodeArray() {
        if (callExpr.arguments.length === 0)
            return throwError(`Unable to parse call expression. No arguments provided: ${printCallExpression(callExpr)}`);

        const firstArgument = callExpr.arguments[0];
        if (callExpr.arguments.length === 1 && firstArgument.kind === "Function")
            return handleFunction(firstArgument);
        else
            return callExpr.arguments;

        function handleFunction(func: FunctionNode) {
            const functionReturnValue = func.value;

            if (functionReturnValue == null || functionReturnValue.kind !== "ArrayLiteral")
                return throwError(`Unsupported toArray call expression. An array must be returned by the provided function: ${printCallExpression(callExpr)}`);

            return functionReturnValue.elements;
        }
    }
}

function parseNameofExpression(expression: Node) {
    const lastNode = getNodeForNameOf();

    switch (lastNode.kind) {
        case "Identifier":
            return createStringLiteralNode(lastNode.value);
        case "StringLiteral":
            // make a copy
            return createStringLiteralNode(lastNode.value);
        case "TemplateExpression":
            // todo: test this
            return createTemplateExpressionNode(lastNode.parts);
        case "NumericLiteral":
            // make a copy
            return createStringLiteralNode(lastNode.value.toString());
        case "Function":
            return throwError(`Nesting functions is not supported: ${printNode(expression)}`);
        case "Computed":
            if (lastNode.value.kind === "StringLiteral" && lastNode.value.next == null)
                return createStringLiteralNode(lastNode.value.value);
            return throwError(`First accessed property must not be computed except if providing a string: ${printNode(expression)}`);
        case "Interpolate":
        case "ArrayLiteral":
        case "ImportType":
            return throwNotSupportedErrorForNode(lastNode);
        default:
            return assertNever(lastNode, `Not implemented node: ${JSON.stringify(lastNode)}`);
    }

    function getNodeForNameOf() {
        let node = getLastNextNode(expression);
        if (node.kind === "Function") {
            const argument = node.value;
            if (argument.next == null)
                return throwError(`A property must be accessed on the object: ${printNode(expression)}`);
            return getLastNextNode(argument.next);
        }
        return node;
    }
}

function parseNameofFullExpression(expressionNodes: Node[]): StringLiteralNode | TemplateExpressionNode {
    const nodeBuilder = new StringOrTemplateExpressionNodeBuilder();

    for (const node of expressionNodes)
        addNodeToBuilder(node);

    return nodeBuilder.buildNode();

    function addNodeToBuilder(node: Node) {
        switch (node.kind) {
            case "Identifier":
                if (nodeBuilder.hasText())
                    nodeBuilder.addText(".");
                nodeBuilder.addText(node.value);
                break;
            case "Computed":
                nodeBuilder.addText("[");
                const computedNodes = flattenNodeToArray(node.value);
                for (const computedNode of computedNodes) {
                    if (computedNode.kind === "StringLiteral")
                        nodeBuilder.addText(`"${computedNode.value}"`);
                    else
                        addNodeToBuilder(computedNode);
                }
                nodeBuilder.addText("]");
                break;
            case "TemplateExpression":
            case "StringLiteral":
                nodeBuilder.addItem(node);
                break;
            case "NumericLiteral":
                nodeBuilder.addText(node.value.toString());
                break;
            case "Interpolate":
                nodeBuilder.addItem(node);
                break;
            case "ArrayLiteral":
            case "ImportType":
            case "Function":
                return throwNotSupportedErrorForNode(node);
            default:
                return assertNever(node, `Not implemented node: ${JSON.stringify(node)}`);
        }
    }
}

function throwNotSupportedErrorForNode(node: Node) {
    return throwError(`The node \`${printNode(node)}\` is not supported in this scenario.`);
}
