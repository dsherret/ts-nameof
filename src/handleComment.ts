import {StringIterator} from "./StringIterator";

export function handleComment(iterator: StringIterator) {
    if (isOpenCommentChar(iterator)) {
        while (iterator.canMoveNext()) {
            if (isCloseCommentChar(iterator)) {
                iterator.moveNext();
                break;
            }
            else {
                iterator.moveNext();
            }
        }
    }
    else if (isCommentChar(iterator)) {
        while (iterator.canMoveNext() && iterator.getLastChar() !== "\n") {
            iterator.moveNext();
        }
    }
}

function isOpenCommentChar(iterator: StringIterator) {
    return iterator.getLastChar() === "/" && iterator.getCurrentChar() === "*";
}

function isCommentChar(iterator: StringIterator) {
    return iterator.getLastChar() === "/" && iterator.getCurrentChar() === "/";
}

function isCloseCommentChar(iterator: StringIterator) {
    return iterator.getLastChar() === "*" && iterator.getCurrentChar() === "/";
}
