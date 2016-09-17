import {ReplaceInfo} from "./ReplaceInfo";
import {StringIterator} from "./StringIterator";

// todo: cleanup

export class NameOfFinder {
    private stringCharStack: string[] = [];
    private currentMatchIndex = 0;
    private validNameChars = /[A-Za-z0-9_]/;
    private validCharsInParens = /[A-Za-z0-9_\.\s]/;
    private readonly searchingMethodName = "nameof";

    constructor(private readonly iterator: StringIterator) {
    }

    indexOfAll() {
        this.currentMatchIndex = 0;
        const currentCharMatches = () => this.currentMatchIndex < this.searchingMethodName.length && this.iterator.getCurrentChar() === this.searchingMethodName[this.currentMatchIndex];
        const isValidFirstChar = () => !this.isValidNameChar(this.iterator.getLastChar()) && this.iterator.getLastChar() !== ".";
        const foundIndexes: ReplaceInfo[] = [];

        while (this.iterator.canMoveNext()) {
            this.handleStringChar();
            this.handleComment();

            if (!this.isInString() && currentCharMatches() && (this.currentMatchIndex !== 0 || isValidFirstChar())) {
                this.currentMatchIndex++;
            }
            else {
                this.currentMatchIndex = 0;
            }

            if (this.currentMatchIndex === this.searchingMethodName.length) {
                this.iterator.moveNext();

                const foundIndex = this.handleFoundName();

                if (foundIndex != null) {
                    foundIndexes.push(foundIndex);
                }

                this.currentMatchIndex = 0;
            }

            if (this.iterator.canMoveNext()) {
                this.iterator.moveNext();
            }
        }

        return foundIndexes;
    }

    private handleFoundName() {
        const startIndex = this.iterator.getCurrentIndex() - this.searchingMethodName.length;
        let foundIndex: ReplaceInfo | null = null;
        let angleText: string = "";

        this.iterator.passSpaces();

        if (this.iterator.getCurrentChar() === "<") {
            this.iterator.moveNext();

            let angleBrackets = 1;
            while (angleBrackets > 0 && this.iterator.canMoveNext()) {
                if (this.iterator.getCurrentChar() === ">") {
                    angleBrackets--;
                }
                else if (this.iterator.getCurrentChar() === "<") {
                    angleBrackets++;
                }
                else if (!this.validCharsInParens.test(this.iterator.getCurrentChar())) {
                    return null;
                }

                if (angleBrackets !== 0) {
                    angleText += this.iterator.getCurrentChar();
                }

                this.iterator.moveNext();
            }
        }

        if (this.iterator.getCurrentChar() === "(") {
            let foundParen = false;
            let argText = "";
            this.iterator.moveNext();

            while (!foundParen && this.iterator.canMoveNext()) {
                if (this.iterator.getCurrentChar() === ")") {
                   foundParen = true;
                }
                else if (!this.validCharsInParens.test(this.iterator.getCurrentChar())) {
                    return null;
                }
                else {
                    argText += this.iterator.getCurrentChar();
                }

                if (foundParen) {
                    foundIndex = {
                        pos: startIndex,
                        end: this.iterator.getCurrentIndex() + 1,
                        argText,
                        angleText
                    };
                }

                this.iterator.moveNext();
            }
        }

        return foundIndex;
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

        this.currentMatchIndex = 0;

        if (this.isOpenCommentChar()) {
            while (this.iterator.getCurrentIndex() < this.iterator.getLength() && !this.isCloseCommentChar()) {
                this.iterator.moveNext();
            }
        }
        else if (this.isCommentChar()) {
            while (this.iterator.getCurrentIndex() < this.iterator.getLength() && this.iterator.getCurrentChar() !== "\n") {
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
