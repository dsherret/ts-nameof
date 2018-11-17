import * as through from "through2";
import { replaceInText } from "./replaceInText";
import { throwError } from "../utils";

interface GulpChunk {
    contents: Buffer;
}

export function stream(fileName: string) {
    if (arguments.length !== 1)
        throwError("stream expects a single fileName argument.");

    return through.obj(transform);

    function transform(chunk: Buffer | GulpChunk, encoding: string, callback: (error: any, file: Buffer | GulpChunk) => void) {
        let err: any;

        try {
            const result = replaceInText(fileName, getContentsAsString(chunk, encoding));
            if (result.replaced)
                chunk = getNewBuffer(chunk, result.fileText!);
        } catch (e) {
            err = e;
        }

        callback(err, chunk);
    }
}

function getContentsAsString(chunk: Buffer | GulpChunk, encoding: string) {
    if (isGulpChunk(chunk))
        return chunk.contents.toString(encoding);
    else
        return chunk.toString();
}

function getNewBuffer(chunk: Buffer | GulpChunk, newText: string): Buffer | GulpChunk {
    if (isGulpChunk(chunk)) {
        chunk.contents = new Buffer(newText);
        return chunk;
    }
    else
        return new Buffer(newText);
}

function isGulpChunk(chunk: Buffer | GulpChunk): chunk is GulpChunk {
    return chunk != null && typeof (chunk as GulpChunk).contents !== "undefined";
}
