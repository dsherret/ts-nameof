import {CharStateInfo} from "./CharStateInfo";

export abstract class StateGenerator {
    abstract getNextState(info: CharStateInfo): boolean;
    abstract get numberNextCharsRequired(): number;
    abstract get numberPreviousCharsRequired(): number;
    abstract get numberPreviousStatesRequired(): number;
}
