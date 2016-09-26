export abstract class StateGenerator {
    protected chars = "";

    abstract getNextState(): boolean;
    abstract shouldGetNext(): boolean;

    removeChar() {
        this.chars = this.chars.substring(1);
    }

    feedChar(char: string) {
        this.chars += char;
    }

    hasNext() {
        return this.chars.length > 0;
    }
}
