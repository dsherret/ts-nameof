export class StringIterator {
    private currentIndex = 0;
    private stateStack: number[] = [];

    constructor(private text: string) {
    }

    saveState() {
        this.stateStack.push(this.currentIndex);
    }

    restoreLastState() {
        if (this.stateStack.length === 0)
            throw new Error("Cannot restore a state that hasn't been saved.");

        this.currentIndex = this.stateStack.pop()!;
    }

    clearLastState() {
        if (this.stateStack.length === 0)
            throw new Error("Cannot clear a state that hasn't been saved.");

        this.stateStack.pop();
    }

    getNumberStatesForTesting() {
        return this.stateStack.length;
    }

    passSpaces() {
        while (this.canMoveNext() && (this.getCurrentChar() === " " || this.getCurrentChar() === "\t"))
            this.moveNext();
    }

    canMoveNext() {
        return this.getCurrentIndex() < this.getLength();
    }

    moveNext() {
        if (!this.canMoveNext())
            throw new Error("Cannot move next if at the end of the string.");

        this.currentIndex++;
    }

    getCurrentIndex() {
        return this.currentIndex;
    }

    isPreviousEscape() {
        // example: "\\" would be a count of 2 and false while "\\\" would be a count of 3 and true
        let i = this.currentIndex;
        while (i > 0 && this.text[i - 1] === "\\")
            i--;
        return (this.currentIndex - i) % 2 === 1;
    }

    getCurrentChar() {
        if (this.currentIndex === this.getLength())
            throw new Error("Cannot get the current character at the end of a string.");

        return this.text[this.currentIndex];
    }

    getLastNonSpaceChar() {
        let currentIndex = this.currentIndex - 1;

        while (currentIndex >= 0) {
            const char = this.text[currentIndex];

            if (!/[\s\r\n\t]/.test(char))
                break;

            currentIndex--;
        }

        return currentIndex < 0 ? undefined : this.text[currentIndex];
    }

    peekNextChar() {
        if (this.currentIndex + 1 >= this.getLength())
            return undefined;
        return this.text[this.currentIndex + 1];
    }

    getLastChar() {
        return this.currentIndex === 0 ? undefined : this.text[this.currentIndex - 1];
    }

    getSecondLastChar() {
        return this.currentIndex <= 1 ? undefined : this.text[this.currentIndex - 2];
    }

    getLength() {
        return this.text.length;
    }
}
