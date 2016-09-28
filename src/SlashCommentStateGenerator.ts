import {StateGenerator} from "./StateGenerator";
import {CharStateInfo} from "./CharStateInfo";

export class SlashCommentStateGenerator extends StateGenerator {
    getNextState(info: CharStateInfo) {
        if (info.nextChars.length === 0)
            throw new Error("Must provide more than 0 next chars.");

        const isStartComment = info.getNextCharsEquals("//");

        if (isStartComment)
            return true;

        const isLastNewLine = info.getPreviousCharsEquals("\n");
        const isLastInComment = info.getPreviousState();

        return isLastInComment && !isLastNewLine;
    }

    get numberNextCharsRequired() {
        return 2;
    }

    get numberPreviousCharsRequired() {
        return 1;
    }

    get numberPreviousStatesRequired() {
        return 1;
    }
}
