import {ReplaceInfo} from "./ReplaceInfo";
import {StringIterator} from "./StringIterator";
import {handleNameOf} from "./handleNameOf";
import {handleComment} from "./handleComment";

export class NameOfFinder {
    private stringCharStack: string[] = [];
    private validNameChars = /[A-Za-z0-9_]/;

    constructor(private readonly iterator: StringIterator) {
    }

    indexOfAll() {
        const isValidFirstChar = () => !this.isValidNameChar(this.iterator.getLastChar()) && this.iterator.getLastNonSpaceChar() !== ".";
        const foundIndexes: ReplaceInfo[] = [];

        while (this.iterator.canMoveNext()) {
            this.handleStringChar();

            if (!this.isInString()) {
                handleComment(this.iterator);

                if (isValidFirstChar()) {
                    const foundIndex = handleNameOf(this.iterator);

                    if (foundIndex != null) {
                        foundIndexes.push(foundIndex);
                    }
                }
            }

            if (this.iterator.canMoveNext()) {
                this.iterator.moveNext();
            }
        }

        return foundIndexes;
    }

    private isValidNameChar(char: string | null) {
        return char != null && this.validNameChars.test(char);
    }

    private handleStringChar() {
        if (this.isCurrentStringChar()) {
            const lastStringChar = this.getLastStringCharOnStack();
            const currentChar = this.iterator.getCurrentChar();

            if (currentChar === lastStringChar) {
                this.stringCharStack.pop();
            }
            else {
                this.stringCharStack.push(currentChar === "{" ? "}" : currentChar);
            }
        }
    }

    private isCurrentStringChar() {
        const lastChar = this.iterator.getLastChar();
        const currentChar = this.iterator.getCurrentChar();
        const lastStringChar = this.getLastStringCharOnStack();

        if (lastChar === "\\") {
            return false;
        }
        else if (lastStringChar == null) {
            return currentChar === "`" || currentChar === "'" || currentChar === "\"";
        }
        else if (lastStringChar === "`" && lastChar === "$" && currentChar === "{") {
            return true;
        }
        else if (lastStringChar === "}" && currentChar === "}") {
            return true;
        }
        else {
            return currentChar === lastStringChar;
        }
    }

    private isInString() {
        return this.stringCharStack.length > 0 && this.getLastStringCharOnStack() !== "}";
    }

    private getLastStringCharOnStack(): string | null {
        if (this.stringCharStack.length > 0) {
            return this.stringCharStack[this.stringCharStack.length - 1];
        }
        else {
            return null;
        }
    }
}
