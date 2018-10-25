import { StringIterator } from "./StringIterator";

export function handleComment(iterator: StringIterator) {
    if (isOpenCommentChar(iterator))
        handleOpenCommentChar(iterator);
    else if (isCommentChar(iterator))
        handleCommentChar(iterator);
}

function handleOpenCommentChar(iterator: StringIterator) {
    while (iterator.canMoveNext()) {
        if (isCloseCommentChar(iterator)) {
            iterator.moveNext();
            break;
        }
        else
            iterator.moveNext();
    }
}

function handleCommentChar(iterator: StringIterator) {
    while (iterator.canMoveNext() && iterator.getCurrentChar() !== "\n")
        iterator.moveNext();
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
