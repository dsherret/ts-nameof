export class CharStateInfo {
    constructor(public previousChars: string, public nextChars: string, public previousStates: boolean[]) {
    }

    getPreviousCharsEquals(value: string, offset = 0) {
        return this.previousChars.substr(this.previousChars.length - value.length - offset, value.length) === value;
    }

    getNextCharsEquals(value: string, offset = 0) {
        return this.nextChars.substr(offset, value.length) === value;
    }

    getPreviousState(offset = 0) {
        return this.previousStates[offset] || false;
    }
}
