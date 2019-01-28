import * as babelTypes from "@babel/types";
import { NodePath } from "@babel/traverse";
import { transform } from "./external/transforms-common";
import { parse } from "./parse";

export default function({ types: t }: { types: typeof babelTypes }) {
    const visitor = {
        CallExpression(path: NodePath) {
            const parseResult = parse(t, path, () => path.traverse(visitor));
            if (parseResult == null)
                return;
            const transformResult = transform(parseResult);
            if (transformResult != null)
                path.replaceWith(t.stringLiteral(transformResult));
        }
    };
    return { visitor };
}
