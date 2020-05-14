import * as babelTypes from "@babel/types";
import * as babel from "@babel/core";
import { NodePath, Node } from "@babel/traverse";
import { throwErrorForSourceFile } from "@ts-nameof/common";
import { transformCallExpression } from "@ts-nameof/transforms-common";
import { parse, ParseOptions } from "./parse";
import { transform } from "./transform";

export interface TransformOptions extends ParseOptions {
}

export function plugin({ types: t }: { types: typeof babelTypes; }): babel.PluginItem {
    const visitor = {
        CallExpression(path: NodePath, state: unknown) {
            const filePath = (state as any).file.opts.filename as string;
            try {
                transformNode(t, path, {
                    // temp assertion because I'm too lazy to investigate what's going on here
                    traverseChildren: () => path.traverse(visitor as any, (state as any))
                });
            } catch (err) {
                return throwErrorForSourceFile(err.message, filePath);
            }
        }
    };
    return { visitor };
}

export function transformNode(t: typeof babelTypes, path: NodePath, options: TransformOptions = {}) {
    const parseResult = parse(t, path, options);
    if (parseResult == null)
        return;
    const transformResult = transform(t, transformCallExpression(parseResult));
    // temporary assertion due to conflicting type declaration versions
    path.replaceWith(transformResult as Node);
}
