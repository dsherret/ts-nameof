import { ReplaceInfo } from "./ReplaceInfo";
import { StringIterator } from "./StringIterator";
import { handleNameOf } from "./handleNameOf";
import { handleComment } from "./handleComment";

export class NameOfFinder {
    private stringCharStack: string[] = [];
    private validNameChars = /[A-Za-z0-9_]/;

    constructor(private readonly iterator: StringIterator) {
    }

    indexOfAll() {
        const isValidFirstChar = () => !this.isValidNameChar(this.iterator.getLastChar()) && this.iterator.getLastNonSpaceChar() !== ".";
        const foundIndexes: ReplaceInfo[] = [];

        while (this.iterator.canMoveNext()) {
            this.handleRegexLiteral();
            this.handleStringChar();

            if (!this.isInString()) {
                handleComment(this.iterator);

                if (isValidFirstChar()) {
                    const foundIndex = handleNameOf(this.iterator);

                    if (foundIndex != null) {
                        foundIndexes.push(foundIndex);
                        continue;
                    }
                }
            }

            if (this.iterator.canMoveNext())
                this.iterator.moveNext();
        }

        return foundIndexes;
    }

    private isValidNameChar(char: string | undefined) {
        return char != null && this.validNameChars.test(char);
    }

    private handleStringChar() {
        if (!this.isCurrentStringChar())
            return;

        const lastStringChar = this.getLastStringCharOnStack();
        const currentChar = this.iterator.getCurrentChar();
        const isBrace = currentChar === "}" || currentChar === "{";

        if ((!isBrace && currentChar === lastStringChar) || (lastStringChar === "{" && currentChar === "}"))
            this.stringCharStack.pop();
        else
            this.stringCharStack.push(currentChar);
    }

    private handleRegexLiteral() {
        if (!this.isCurrentRegexChar())
            return;

        while (this.iterator.canMoveNext()) {
            this.iterator.moveNext();

            if (this.isCurrentRegexChar())
                break;
        }
    }

    private isCurrentStringChar() {
        if (this.iterator.isPreviousEscape())
            return false;

        const lastChar = this.iterator.getLastChar();
        const currentChar = this.iterator.getCurrentChar();
        const lastStringChar = this.getLastStringCharOnStack();

        if (lastStringChar == null)
            return currentChar === "`" || currentChar === "'" || currentChar === "\"";
        else if (lastStringChar === "`" && lastChar === "$" && currentChar === "{")
            return true;
        else if (lastStringChar === "{" && currentChar === "{")
            return true;
        else if (lastStringChar === "{" && currentChar === "}")
            return true;
        else
            return currentChar === lastStringChar;
    }

    private isCurrentRegexChar() {
        if (this.isInString() || this.iterator.isPreviousEscape())
            return false;

        return this.iterator.getLastChar() !== "/" && this.iterator.getCurrentChar() === "/" && this.iterator.peekNextChar() !== "/";
    }

    private isInString() {
        return this.stringCharStack.length > 0 && this.getLastStringCharOnStack() !== "{";
    }

    private getLastStringCharOnStack(): string | undefined {
        if (this.stringCharStack.length > 0)
            return this.stringCharStack[this.stringCharStack.length - 1];
        else
            return undefined;
    }
}
