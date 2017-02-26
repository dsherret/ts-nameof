import {ReplaceInfo} from "./ReplaceInfo";

export function replaceCallExpressionReplacesInText(callExpressionReplaces: ReplaceInfo[], data: string) {
    for (let i = 0; i < callExpressionReplaces.length; i++) {
        let text: string;
        const currentReplace = callExpressionReplaces[i];
        const argText = currentReplace.args[0] || "";
        const typeArgText = currentReplace.typeArgText;
        const isNameofFullWithTypeParam = currentReplace.showFull && typeArgText.length > 0;

        if (argText.length > 0 && !isNameofFullWithTypeParam)
            text = argText;
        else {
            text = typeArgText;
            const bracketIndex = text.indexOf("<");
            if (bracketIndex > 0)
                text = text.substring(0, bracketIndex);
        }

        const periodIndexArgument = getReplaceInfoStartIndexArgument(currentReplace);
        const newText = (currentReplace.showFull ? `"${getFullText(text, periodIndexArgument)}"` : `"${getArgText(text)}"`).replace(/ /g, "");
        const offset = newText.length - (currentReplace.end - currentReplace.pos);

        data = data.substring(0, currentReplace.pos) + newText + data.substring(currentReplace.end);

        for (let j = i + 1; j < callExpressionReplaces.length; j++) {
            callExpressionReplaces[j].pos += offset;
            callExpressionReplaces[j].end += offset;
        }
    }

    return data;
}

function getReplaceInfoStartIndexArgument(currentReplace: ReplaceInfo) {
    if (!currentReplace.showFull || currentReplace.args.length === 0)
        return "";

    if (currentReplace.typeArgText.length > 0)
        return currentReplace.args[0];

    if (currentReplace.args.length > 1)
        return currentReplace.args[1];

    return "";
}

function getFullText(text: string, periodIndexText: string) {
    if (periodIndexText.length === 0)
        return text;

    const periodIndex = parseInt(periodIndexText, 10);
    if (isNaN(periodIndex))
        throw new Error(`periodIndex parameter "${periodIndex}" of nameof.full must be a number literal (ex. 1, -1, 2, etc.).`);

    if (periodIndex > 0) {
        let currentDotIndex = -1;
        for (let i = 0; i < periodIndex; i++) {
            currentDotIndex = text.indexOf(".", currentDotIndex + 1);
            if (currentDotIndex === -1)
                throw new Error(`Value of periodIndex parameter "${periodIndex}" of nameof.full must not exceed the number of periods in the text.`);
        }

        text = text.substring(currentDotIndex + 1);
    }
    else if (periodIndex < 0) {
        let currentDotIndex = text.length;
        for (let i = 0; i > periodIndex; i--) {
            currentDotIndex = text.lastIndexOf(".", currentDotIndex - 1);
            if (currentDotIndex === -1 && i !== periodIndex + 1)
                throw new Error(`Absolute value of negative periodIndex parameter "${periodIndex}" of nameof.full must not exceed the number of periods in the text + 1.`);
        }
        text = text.substring(currentDotIndex + 1);
    }

    return text;
}

function getArgText(text: string) {
    const startIndex = text.lastIndexOf(".") + 1;
    let endIndex = text.length;
    const lastSemiColonIndex = text.lastIndexOf(";");
    const lastBraceIndex = text.lastIndexOf("}");

    if (lastSemiColonIndex > 0)
        endIndex = lastSemiColonIndex;

    if (lastBraceIndex > 0 && lastBraceIndex < endIndex)
        endIndex = lastBraceIndex;

    return text.substring(startIndex, endIndex);
}
