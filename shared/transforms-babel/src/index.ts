import * as babelTypes from "@babel/types";
import { NodePath } from "@babel/traverse";
import { transformCallExpression } from "./external/transforms-common";
import { parse, ParseOptions } from "./parse";
import { transform } from "./transform";

export interface TransformOptions extends ParseOptions {
}

export function plugin({ types: t }: { types: typeof babelTypes }) {
    const visitor = {
        CallExpression(path: NodePath) {
            transformNode(t, path, {
                traverseChildren: () => path.traverse(visitor)
            });
        }
    };
    return { visitor };
}

export function transformNode(t: typeof babelTypes, path: NodePath, options: TransformOptions = {}) {
    const parseResult = parse(t, path, options);
    if (parseResult == null)
        return;
    const transformResult = transform(t, transformCallExpression(parseResult));
    path.replaceWith(transformResult);
}
