// common AST to share between babel and typescript

export interface NameofCallExpression {
    property: string | undefined;
    typeArguments: Node[];
    arguments: Node[];
}

export type Node = IdentifierNode | StringLiteralNode | NumericLiteralNode | ComputedNode | FunctionNode;

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

/** Node surrounded in brackets (ex. `[4]`) */
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
