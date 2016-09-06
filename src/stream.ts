import * as through from "through2";
import {NameOfFinder} from "./NameOfFinder";
import {replaceCallExpressionReplacesInText} from "./replaceCallExpressionReplacesInText";

type GulpChunk = { contents: Buffer; };

export function stream() {
    function transform(chunk: Buffer | GulpChunk, encoding: string, callback: (error: any, file: Buffer | GulpChunk) => void) {
        let err: any = null;

        try {
            let result = getReplacedText(getContentsAsString(chunk));

            if (result.replaced) {
                chunk = getNewBuffer(chunk, result.fileText!);
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

function getContentsAsString(chunk: Buffer | GulpChunk) {
    if (isGulpChunk(chunk)) {
        return chunk.contents.toString();
    }
    else {
        return chunk.toString();
    }
}

function getNewBuffer(chunk: Buffer | GulpChunk, newText: string) {
    if (isGulpChunk(chunk)) {
        return chunk.contents = new Buffer(newText);
    }
    else {
        return new Buffer(newText);
    }
}

function isGulpChunk(chunk: Buffer | GulpChunk): chunk is GulpChunk {
    return chunk != null && typeof (chunk as GulpChunk).contents !== "undefined";
}
