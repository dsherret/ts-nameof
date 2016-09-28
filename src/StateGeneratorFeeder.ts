/*
import {StateGenerator} from "./StateGenerator";

export class StateGeneratorFeeder {
    private readonly callbacks: ((state: boolean) => void)[] = [];

    constructor(private readonly stateGenerator: StateGenerator) {
    }

    feedNextChar(char: string) {
        this.stateGenerator.feedChar(char);
        this.tryProcessQueue();
    }

    getNextStateAsync(callback: (state: boolean) => void) {
        this.callbacks.push(callback);
        this.tryProcessQueue();
    }

    doEndOfStream() {
        while (this.stateGenerator.hasNext())
            this.processNext();
    }

    private tryProcessQueue() {
        while (this.shouldProcessNext())
            this.processNext();
    }

    private shouldProcessNext() {
        return this.stateGenerator.hasNext() && this.stateGenerator.shouldGetNext() && this.callbacks.length > 0;
    }

    private processNext() {
        const state = this.stateGenerator.getNextState();
        const callback = this.callbacks.shift();
        this.stateGenerator.removeChar();

        if (callback instanceof Function) {
            callback(state);
        }
    }
}
*/
