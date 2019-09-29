import { Node, IdentifierNode, StringLiteralNode, NumericLiteralNode, ArrayLiteralNode, ComputedNode, FunctionNode, ImportTypeNode, InterpolateNode,
    TemplateExpressionNode } from "./nodes";

export function createIdentifierNode(value: string, next?: Node | undefined): IdentifierNode {
    return {
        kind: "Identifier",
        value,
        next
    };
}

export function createStringLiteralNode(value: string, next?: Node | undefined): StringLiteralNode {
    return {
        kind: "StringLiteral",
        value,
        next
    };
}

export function createNumericLiteralNode(value: number, next?: Node | undefined): NumericLiteralNode {
    return {
        kind: "NumericLiteral",
        value,
        next
    };
}

export function createArrayLiteralNode(elements: ArrayLiteralNode["elements"], next?: Node | undefined): ArrayLiteralNode {
    return {
        kind: "ArrayLiteral",
        elements,
        next
    };
}

export function createComputedNode(value: Node, next?: Node | undefined): ComputedNode {
    return {
        kind: "Computed",
        value,
        next
    };
}

export function createFunctionNode(value: Node, parameterNames: string[], next?: Node | undefined): FunctionNode {
    return {
        kind: "Function",
        parameterNames,
        value,
        next
    };
}

export function createImportTypeNode(isTypeOf: boolean, argument: Node | undefined, next?: Node | undefined): ImportTypeNode {
    return {
        kind: "ImportType",
        isTypeOf,
        argument,
        next
    };
}

export function createTemplateExpressionNode(parts: (string | InterpolateNode)[], next?: Node | undefined): TemplateExpressionNode {
    return {
        kind: "TemplateExpression",
        parts,
        next
    };
}

export function createInterpolateNode(expression: unknown, expressionText: string, next?: Node | undefined): InterpolateNode {
    return {
        kind: "Interpolate",
        expression,
        expressionText,
        next
    };
}
