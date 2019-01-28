import * as babelTypes from "@babel/types";
import { NodePath } from "@babel/traverse";
import { transformCallExpression } from "./external/transforms-common";
import { parse } from "./parse";
import { transform } from "./transform";

export function plugin({ types: t }: { types: typeof babelTypes }) {
    const visitor = {
        CallExpression(path: NodePath) {
            transformNode(t, path, () => path.traverse(visitor));
        }
    };
    return { visitor };
}

export function transformNode(t: typeof babelTypes, path: NodePath, visitChildren?: () => void) {
    const parseResult = parse(t, path, visitChildren);
    if (parseResult == null)
        return;
    const transformResult = transform(t, transformCallExpression(parseResult));
    path.replaceWith(transformResult);
}
