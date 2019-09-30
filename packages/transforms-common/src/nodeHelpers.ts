import { Node } from "./nodes";

export function flattenNodeToArray(node: Node) {
    const flattenedNodes: Node[] = [node];
    while (node.next != null) {
        flattenedNodes.push(node.next);
        node = node.next;
    }
    return flattenedNodes;
}

export function getLastNextNode(node: Node) {
    while (node.next != null)
        node = node.next;
    return node;
}
