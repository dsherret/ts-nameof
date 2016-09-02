import {ReplaceInfo} from "./ReplaceInfo";

// todo: cleanup

export class NameOfFinder {
    private stringCharStack: string[] = [];
    private currentIndex = 0;
    private currentMatchIndex = 0;
    private validNameChars = /[A-Za-z0-9_]/;
    private validCharsInParens = /[A-Za-z0-9_\.\s]/;
    private readonly searchingMethodName = "nameof";

    constructor(private readonly text: string) {
    }

    indexOfAll() {
        this.currentMatchIndex = 0;
        const currentCharMatches = () => this.currentMatchIndex < this.searchingMethodName.length && this.getCurrentChar() === this.searchingMethodName[this.currentMatchIndex];
        const isValidFirstChar = () => !this.isValidNameChar(this.getLastChar()) && this.getLastChar() !== ".";
        const foundIndexes: ReplaceInfo[] = [];

        for (this.currentIndex = 0; this.currentIndex < this.text.length; this.currentIndex++) {
            this.handleStringChar();
            this.handleComment();

            if (!this.isInString() && currentCharMatches() && (this.currentMatchIndex !== 0 || isValidFirstChar())) {
                this.currentMatchIndex++;
            }
            else {
                this.currentMatchIndex = 0;
            }

            if (this.currentMatchIndex === this.searchingMethodName.length) {
                this.currentIndex++;

                const foundIndex = this.handleFoundName();

                if (foundIndex != null) {
                    foundIndexes.push(foundIndex);
                }

                this.currentMatchIndex = 0;
            }
        }

        return foundIndexes;
    }

    private passSpaces() {
        while (this.currentIndex < this.text.length && this.getCurrentChar() === " ") {
            this.currentIndex++;
        }
    }

    private handleFoundName() {
        const startIndex = this.currentIndex - this.searchingMethodName.length;
        let foundIndex: ReplaceInfo | null = null;
        let angleText: string = "";

        this.passSpaces();

        if (this.getCurrentChar() === "<") {
            this.currentIndex++;

            let angleBrackets = 1;
            while (angleBrackets > 0 && this.currentIndex < this.text.length) {
                if (this.getCurrentChar() === ">") {
                    angleBrackets--;
                }
                else if (this.getCurrentChar() === "<") {
                    angleBrackets++;
                }
                else if (!this.validCharsInParens.test(this.getCurrentChar())) {
                    return;
                }

                this.currentIndex++;
            }

            angleText = this.text.substring(this.text.indexOf("<", startIndex) + 1, this.currentIndex - 1);
        }

        if (this.getCurrentChar() === "(") {
            let foundParen = false;
            this.currentIndex++;

            while (!foundParen && this.currentIndex < this.text.length) {
                if (this.getCurrentChar() === ")") {
                   foundParen = true;
                }
                else if (!this.validCharsInParens.test(this.getCurrentChar())) {
                    return;
                }

                if (foundParen) {
                    foundIndex = {
                        pos: startIndex,
                        end: this.currentIndex + 1,
                        argText: this.text.substring(this.text.indexOf("(", startIndex) + 1, this.currentIndex),
                        angleText
                    };
                }

                this.currentIndex++;
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
            const currentChar = this.getCurrentChar();

            if (currentChar === lastStringChar) {
                this.stringCharStack.pop();
            }
            else {
                this.stringCharStack.push(currentChar === "{" ? "}" : currentChar);
            }
        }
    }

    private isCurrentStringChar() {
        const lastChar = this.getLastChar();
        const currentChar = this.getCurrentChar();
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
            while (this.currentIndex < this.text.length && !this.isCloseCommentChar()) {
                this.currentIndex++;
            }
        }
        else if (this.isCommentChar()) {
            while (this.currentIndex < this.text.length && this.getCurrentChar() !== "\n") {
                this.currentIndex++;
            }
        }
    }

    private isInString() {
        return this.stringCharStack.length > 0 && this.getLastStringCharOnStack() !== "}";
    }

    private getLastStringCharOnStack() {
        if (this.stringCharStack.length > 0) {
            return this.stringCharStack[this.stringCharStack.length - 1];
        }
        else {
            return null;
        }
    }

    private isCommentChar() {
        return this.getLastChar() === "/" && this.getCurrentChar() === "/";
    }

    private isOpenCommentChar() {
        return this.getLastChar() === "/" && this.getCurrentChar() === "*";
    }

    private isCloseCommentChar() {
        return this.getLastChar() === "*" && this.getCurrentChar() === "/";
    }

    private getLastChar() {
        return this.currentIndex - 1 < 0 ? null : this.text[this.currentIndex - 1];
    }

    private getCurrentChar() {
        return this.text[this.currentIndex];
    }
}
