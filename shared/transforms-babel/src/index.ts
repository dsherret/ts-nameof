import * as babelTypes from "@babel/types";
import { NodePath } from "@babel/traverse";
import { transformCallExpression } from "./external/transforms-common";
import { parse } from "./parse";
import { transform } from "./transform";

export default function({ types: t }: { types: typeof babelTypes }) {
    const visitor = {
        CallExpression(path: NodePath) {
            const parseResult = parse(t, path, () => path.traverse(visitor));
            if (parseResult == null)
                return;
            const transformResult = transform(t, transformCallExpression(parseResult));
            path.replaceWith(transformResult);
        }
    };
    return { visitor };
}
