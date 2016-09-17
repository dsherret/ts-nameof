import {ReplaceInfo} from "./ReplaceInfo";
import {StringIterator} from "./StringIterator";
import {handleNameOf} from "./handleNameOf";

// todo: cleanup

export class NameOfFinder {
    private stringCharStack: string[] = [];
    private validNameChars = /[A-Za-z0-9_]/;

    constructor(private readonly iterator: StringIterator) {
    }

    indexOfAll() {
        const isValidFirstChar = () => !this.isValidNameChar(this.iterator.getLastChar()) && this.iterator.getLastChar() !== ".";
        const foundIndexes: ReplaceInfo[] = [];

        while (this.iterator.canMoveNext()) {
            this.handleStringChar();
            this.handleComment();

            if (isValidFirstChar() && !this.isInString()) {
                const foundIndex = handleNameOf(this.iterator);

                if (foundIndex != null) {
                    foundIndexes.push(foundIndex);
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

    private handleComment() {
        if (this.isInString()) {
            return;
        }

        if (!this.isOpenCommentChar() && !this.isCommentChar()) {
            return;
        }

        if (this.isOpenCommentChar()) {
            while (this.iterator.canMoveNext() && !this.isCloseCommentChar()) {
                this.iterator.moveNext();
            }
        }
        else if (this.isCommentChar()) {
            while (this.iterator.canMoveNext() && this.iterator.getCurrentChar() !== "\n") {
                this.iterator.moveNext();
            }
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

    private isCommentChar() {
        return this.iterator.getLastChar() === "/" && this.iterator.getCurrentChar() === "/";
    }

    private isOpenCommentChar() {
        return this.iterator.getLastChar() === "/" && this.iterator.getCurrentChar() === "*";
    }

    private isCloseCommentChar() {
        return this.iterator.getLastChar() === "*" && this.iterator.getCurrentChar() === "/";
    }
}
