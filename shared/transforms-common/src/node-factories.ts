import { Node, IdentifierNode, StringLiteralNode, NumericLiteralNode, ComputedNode, FunctionNode } from "./nodes";

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
