import {StringIterator} from "./StringIterator";
import {ReplaceInfo} from "./ReplaceInfo";
import {validCharsInTypeArg, validCharsInParens} from "./config";

const searchingFunctionName = "nameof";
const searchingFullPropertyName = "full";

export function handleNameOf(iterator: StringIterator): ReplaceInfo | null {
    const startIndex = iterator.getCurrentIndex();
    iterator.saveState();

    if (!tryHandleFunctionName(iterator)) {
        iterator.restoreLastState();
        return null;
    }

    iterator.passSpaces();

    const showFull = tryHandleFullProperty(iterator);

    iterator.passSpaces();

    const typeArgText = tryGetTypeArgText(iterator);

    iterator.passSpaces();

    const argResult = tryGetArgs(iterator);

    if (!argResult.isValid) {
        iterator.restoreLastState();
        return null;
    }

    iterator.clearLastState();

    return {
        pos: startIndex,
        end: iterator.getCurrentIndex(),
        args: argResult.args,
        typeArgText: (typeArgText || "").trim(),
        showFull
    };
}

export function tryHandleFunctionName(iterator: StringIterator) {
    iterator.saveState();

    for (let char of searchingFunctionName) {
        if (!iterator.canMoveNext() || iterator.getCurrentChar() !== char) {
            iterator.restoreLastState();
            return false;
        }

        iterator.moveNext();
    }

    iterator.clearLastState();
    return true;
}

export function tryHandleFullProperty(iterator: StringIterator) {
    iterator.saveState();

    if (iterator.getCurrentChar() !== ".") {
        iterator.restoreLastState();
        return false;
    }

    iterator.moveNext();
    iterator.passSpaces();

    for (let char of searchingFullPropertyName) {
        if (!iterator.canMoveNext() || iterator.getCurrentChar() !== char) {
            iterator.restoreLastState();
            return false;
        }

        iterator.moveNext();
    }

    iterator.clearLastState();
    return true;
}

export function tryGetTypeArgText(iterator: StringIterator) {
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
            else if (!validCharsInTypeArg.test(iterator.getCurrentChar())) {
                return throwInvalidCharacterInTypeArg(iterator);
            }

            if (angleBrackets === 0) {
                iterator.clearLastState();
                iterator.moveNext();

                return text;
            }
            else {
                text += iterator.getCurrentChar();
                iterator.moveNext();
            }
        }

        iterator.restoreLastState();
        return throwEndOfFile();
    }
    else {
        iterator.restoreLastState();
        return text;
    }
}

export function tryGetArgs(iterator: StringIterator): { isValid: boolean; args: string[]; } {
    const args: string[] = [];
    let text = "";
    iterator.saveState();

    if (iterator.getCurrentChar() === "(") {
        let parens = 1;
        iterator.moveNext();

        while (iterator.canMoveNext()) {
            if (iterator.getCurrentChar() === ")") {
                parens--;
            }
            else if (iterator.getCurrentChar() === "(") {
                parens++;
            }
            else if (parens === 1 && iterator.getCurrentChar() === ",") {
                args.push(text);
                text = "";
                iterator.moveNext();
                continue;
            }
            else if (!validCharsInParens.test(iterator.getCurrentChar())) {
                return throwInvalidCharacterInArg(iterator);
            }

            if (parens === 0) {
                iterator.moveNext();
                iterator.clearLastState();

                if (text.length > 0)
                    args.push(text);

                return {
                    isValid: true,
                    args: args.map(a => a.trim())
                };
            }
            else {
                text += iterator.getCurrentChar();
            }

            iterator.moveNext();
        }

        iterator.restoreLastState();
        return throwEndOfFile();
    }

    iterator.restoreLastState();

    return {
        isValid: false,
        args: []
    };
}

function throwEndOfFile(): never {
    throw new Error("Invalid nameof at end of file.");
}

function throwInvalidCharacterInTypeArg(iterator: StringIterator): never {
    const char = iterator.getCurrentChar();
    iterator.restoreLastState();

    throw new Error(`Invalid character in nameof type argument: ${char} -- ` +
        `if this should be a valid character then please log an issue. If you wish, you can manually edit config.js in this package to allow the character.`);
}

function throwInvalidCharacterInArg(iterator: StringIterator): never {
    const char = iterator.getCurrentChar();
    iterator.restoreLastState();

    throw new Error(`Invalid character in nameof argument: ${char} -- ` +
        `if this should be a valid character then please log an issue. If you wish, you can manually edit config.js in this package to allow the character.`);
}
