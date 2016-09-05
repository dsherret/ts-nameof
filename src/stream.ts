import * as through from "through2";
import {NameOfFinder} from "./NameOfFinder";
import {replaceCallExpressionReplacesInText} from "./replaceCallExpressionReplacesInText";

export function stream() {
    function transform(chunk: Buffer, encoding: string, callback: (error: any, file: Buffer) => void) {
        let err: any = null;

        try {
            let result = getReplacedText(chunk.toString());

            if (result.replaced) {
                chunk = new Buffer(result.fileText!);
            }
        } catch (e) {
            err = e;
        }

        callback(err, chunk);
    }

    return through.obj(transform);
}

function getReplacedText(fileText: string): { fileText?: string, replaced: boolean } {
    const finder = new NameOfFinder(fileText);
    const indexes = finder.indexOfAll();

    if (indexes.length === 0) {
        return { replaced: false };
    }

    return { fileText: replaceCallExpressionReplacesInText(indexes, fileText), replaced: true };
}
