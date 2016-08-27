import * as ts from "typescript";

export function forAllChildrenOfNode(node: ts.Node, onChild: (node: ts.Node) => void) {
    onChild(node);
    node.getChildren().map(n => forAllChildrenOfNode(n, onChild));
}
