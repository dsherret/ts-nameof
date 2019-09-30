import { NameofCallExpression, Node, TemplateExpressionNode } from "./nodes";
import { assertNever } from "@ts-nameof/common";

/**
 * Prints the call expression to a string. Useful for displaying diagnostic information to the user.
 * @param callExpr `nameof` call expression to print.
 */
export function printCallExpression(callExpr: NameofCallExpression) {
    let result = "nameof";

    writePropertyName();
    if (callExpr.typeArguments.length > 0)
        writeTypeArguments();
    writeArguments();

    return result;

    function writePropertyName() {
        if (callExpr.property != null)
            result += `.${callExpr.property}`;
    }

    function writeTypeArguments() {
        result += "<";
        for (let i = 0; i < callExpr.typeArguments.length; i++) {
            if (i > 0)
                result += ", ";
            result += printNode(callExpr.typeArguments[i]);
        }
        result += ">";
    }

    function writeArguments() {
        result += "(";
        for (let i = 0; i < callExpr.arguments.length; i++) {
            if (i > 0)
                result += ", ";
            result += printNode(callExpr.arguments[i]);
        }
        result += ")";
    }
}

/**
 * Prints a node to a string. Useful for displaying diagnostic information to the user.
 * @param node Node to print.
 */
export function printNode(node: Node): string {
    // todo: this should throw in more scenarios (ex. string literal after an identifier)
    let result = getCurrentText();

    if (node.next != null) {
        if (node.next.kind === "Identifier")
            result += "." + printNode(node.next);
        else
            result += printNode(node.next);
    }

    return result;

    function getCurrentText() {
        switch (node.kind) {
            case "StringLiteral":
                return `\"${node.value}\"`;
            case "NumericLiteral":
                return node.value.toString();
            case "Identifier":
                return node.value;
            case "Computed":
                return `[${printNode(node.value)}]`;
            case "Function":
                let functionResult = `(${node.parameterNames.join(", ")}) => ${printNode(node.value)}`;
                if (node.next != null)
                    functionResult = `(${functionResult})`;
                return functionResult;
            case "ArrayLiteral":
                return `[${node.elements.map(e => printNode(e)).join(", ")}]`;
            case "ImportType":
                return (node.isTypeOf ? "typeof " : "") + `import(${node.argument == null ? "" : printNode(node.argument)})`;
            case "Interpolate":
                return `nameof.interpolate(${node.expressionText})`;
            case "TemplateExpression":
                return printTemplateExpression(node);
            default:
                return assertNever(node, `Unhandled kind: ${(node as Node).kind}`);
        }
    }

    function printTemplateExpression(TemplateExpression: TemplateExpressionNode) {
        let text = "`";
        for (const part of TemplateExpression.parts) {
            if (typeof part === "string")
                text += part;
            else
                text += "${" + printNode(part) + "}";
        }
        text += "`";
        return text;
    }
}
