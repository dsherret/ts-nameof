// common AST to share between babel and typescript

export interface NameofCallExpression {
    property: string | undefined;
    typeArguments: Node[];
    arguments: Node[];
}

export type Node = IdentifierNode | StringLiteralNode | NumericLiteralNode | ArrayLiteralNode | ComputedNode | FunctionNode | ImportTypeNode
    | TemplateExpressionNode | InterpolateNode;

export interface IdentifierNode {
    kind: "Identifier";
    value: string;
    next: Node | undefined;
}

export interface StringLiteralNode {
    kind: "StringLiteral";
    value: string;
    next: Node | undefined;
}

export interface NumericLiteralNode {
    kind: "NumericLiteral";
    value: number;
    next: Node | undefined;
}

export interface ArrayLiteralNode {
    kind: "ArrayLiteral";
    elements: Node[];
    next: Node | undefined;
}

/**
 * Node surrounded in brackets.
 * Ex. `[4]` in `obj[4]`
 */
export interface ComputedNode {
    kind: "Computed";
    value: Node;
    next: Node | undefined;
}

export interface FunctionNode {
    kind: "Function";
    parameterNames: string[];
    value: Node;
    next: Node | undefined;
}

export interface ImportTypeNode {
    kind: "ImportType";
    isTypeOf: boolean;
    argument: Node | undefined;
    next: Node | undefined;
}

export interface TemplateExpressionNode {
    kind: "TemplateExpression";
    parts: (string | InterpolateNode)[];
    next: Node | undefined;
}

/**
 * An interpolate node.
 * Ex. Created from call expressions such as: `nameof.interpolate(expression)`
 */
export interface InterpolateNode {
    kind: "Interpolate";
    /** The original AST node. */
    expression: unknown;
    /** The expression text for printing purposes. */
    expressionText: string;
    next: Node | undefined;
}
