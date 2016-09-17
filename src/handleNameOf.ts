import {StringIterator} from "./StringIterator";
import {ReplaceInfo} from "./ReplaceInfo";

const searchingMethodName = "nameof";
const validCharsInParens = /[A-Za-z0-9_\.\s\t]/;

export function handleNameOf(iterator: StringIterator): ReplaceInfo | null {
    const startIndex = iterator.getCurrentIndex();
    iterator.saveState();

    if (!tryHandleFunctionName(iterator)) {
        iterator.restoreLastState();
        return null;
    }

    iterator.passSpaces();

    const typeArgTextResult = tryGetTypeArgText(iterator);

    if (!typeArgTextResult.isValid) {
        iterator.restoreLastState();
        return null;
    }

    iterator.passSpaces();

    const argTextResult = tryGetArgText(iterator);

    if (!argTextResult.isValid) {
        iterator.restoreLastState();
        return null;
    }

    iterator.clearLastState();

    return {
        pos: startIndex,
        end: iterator.getCurrentIndex(),
        argText: (argTextResult.text || "").trim(),
        typeArgText: (typeArgTextResult.text || "").trim()
    };
}

export function tryHandleFunctionName(iterator: StringIterator) {
    iterator.saveState();

    for (let char of searchingMethodName) {
        if (!iterator.canMoveNext() || iterator.getCurrentChar() !== char) {
            iterator.restoreLastState();
            return false;
        }

        iterator.moveNext();
    }

    iterator.clearLastState();
    return true;
}

export function tryGetTypeArgText(iterator: StringIterator): { isValid: boolean; text?: string } {
    let text = "";
    iterator.saveState();

    if (iterator.getCurrentChar() === "<") {
        let angleBrackets = 1;
        iterator.moveNext();

        while (iterator.canMoveNext()) {
            if (iterator.getCurrentChar() === ">") {
                angleBrackets--;
            }
            else if (iterator.getCurrentChar() === "<") {
                angleBrackets++;
            }
            else if (!validCharsInParens.test(iterator.getCurrentChar())) {
                iterator.restoreLastState();
                return { isValid: false };
            }

            if (angleBrackets === 0) {
                iterator.clearLastState();
                iterator.moveNext();

                return {
                    isValid: true,
                    text
                };
            }
            else {
                text += iterator.getCurrentChar();
                iterator.moveNext();
            }
        }

        iterator.restoreLastState();
        return { isValid: false };
    }
    else {
        iterator.restoreLastState();
        return { isValid: true };
    }
}

export function tryGetArgText(iterator: StringIterator): { isValid: boolean; text?: string; } {
    let text = "";
    iterator.saveState();

    if (iterator.getCurrentChar() === "(") {
        iterator.moveNext();

        while (iterator.canMoveNext()) {
            if (iterator.getCurrentChar() === ")") {
                iterator.moveNext();
                iterator.clearLastState();

                return {
                    isValid: true,
                    text
                };
            }
            else if (!validCharsInParens.test(iterator.getCurrentChar())) {
                iterator.restoreLastState();
                return { isValid: false };
            }
            else {
                text += iterator.getCurrentChar();
            }

            iterator.moveNext();
        }
    }

    iterator.restoreLastState();
    return { isValid: false };
}
