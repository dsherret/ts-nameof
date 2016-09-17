export class StringIterator {
    private currentIndex = 0;

    constructor(private text: string) {
    }

    passSpaces() {
        while (this.canMoveNext() && this.getCurrentChar() === " ") {
            this.moveNext();
        }
    }

    canMoveNext() {
        return this.getCurrentIndex() < this.getLength();
    }

    moveNext() {
        if (!this.canMoveNext()) {
            throw new Error("Cannot move next if at the end of the string.");
        }

        this.currentIndex++;
    }

    getCurrentIndex() {
        return this.currentIndex;
    }

    getCurrentChar() {
        return this.text[this.currentIndex];
    }

    getLastChar() {
        return this.currentIndex === 0 ? null : this.text[this.currentIndex - 1];
    }

    getLength() {
        return this.text.length;
    }
}
