import { throwError } from "./external/common";
import { Node } from "./nodes";
import { printNode } from "./printers";

/**
 * Gets the last node part.
 *
 * For example, give `some.node.like.this` it will return `"this"`.
 */
export function getLastNodePartText(node: Node) {
    const lastPart = getNodeParts(node).pop();
    if (lastPart == null)
        return undefined;
    if (typeof lastPart === "string")
        return lastPart;
    return throwError(`The node \`${printNode(lastPart)}\` is not supported in this scenario.`);
}

/**
 * Gets an array of parts from a node.
 *
 * For example, given `some.node.like.this` it will return `["some", "node", "like", "this"]`.
 * @remarks Will throw when a node part can't be converted to a string.
 */
export function getNodePartTexts(node: Node | undefined) {
    const parts = getNodeParts(node);
    ensureStringArray();
    return parts as string[];

    function ensureStringArray() {
        for (const part of parts) {
            if (typeof part !== "string")
                return throwError(`The node \`${printNode(part)}\` is not supported in this scenario.`);
        }
    }
}

function getNodeParts(initialNode: Node | undefined) {
    return getStringArray(initialNode, undefined);

    function getStringArray(node: Node | undefined, parent: Node | undefined) {
        const result: (string | Node)[] = [];

        while (node != null) {
            if (node.kind === "Computed") {
                const text = `[${getStringArray(node.value, node).join(".")}]`;
                if (result.length === 0)
                    result.push(text);
                else if (typeof result[result.length - 1] !== "string")
                    return throwError(`Unsupported node before a computed property: ${printNode(result[result.length - 1] as Node)}`);
                else
                    (result[result.length - 1] as string) += text;
            }
            else if (node.kind === "Function") {
                if (parent != null)
                    return throwError(`Nesting functions is not supported: ${printNode(node)}`);
                // skip over the first node
                const firstNode = node.value;
                if (firstNode.next == null)
                    return throwError(`A property must be accessed on the object: ${printNode(node)}`);
                if (firstNode.next.kind === "Computed")
                    return throwError(`First accessed property must not be computed: ${printNode(node)}`);
                result.push(...getStringArray(firstNode.next, undefined));
            }
            else if (node.kind === "StringLiteral" && parent != null && parent.kind === "Computed" && result.length === 0)
                result.push(`"${node.value}"`);
            else if (node.kind === "ArrayLiteral" || node.kind === "ImportType")
                result.push(node); // not able to get the string of these node
            else
                result.push(node.value.toString());

            node = node.next;
        }

        return result;
    }
}
