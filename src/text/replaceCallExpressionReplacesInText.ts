import { ReplaceInfo } from "./ReplaceInfo";

export function replaceCallExpressionReplacesInText(callExpressionReplaces: ReplaceInfo[], data: string) {
    for (let i = 0; i < callExpressionReplaces.length; i++) {
        const currentReplace = callExpressionReplaces[i];
        const periodIndexArgIndex = getPeriodIndexArgIndex(currentReplace);
        const text = getReplaceInfoText(currentReplace, periodIndexArgIndex);
        const newText = (currentReplace.showFull
            ? `"${getFullText(text, getPeriodIndexArgText(currentReplace, periodIndexArgIndex))}"`
            : `"${text.substring(text.lastIndexOf(".") + 1)}"`).replace(/ /g, "");
        const offset = newText.length - (currentReplace.end - currentReplace.pos);

        data = data.substring(0, currentReplace.pos) + newText + data.substring(currentReplace.end);

        for (let j = i + 1; j < callExpressionReplaces.length; j++) {
            callExpressionReplaces[j].pos += offset;
            callExpressionReplaces[j].end += offset;
        }
    }

    return data;
}

function getReplaceInfoText(currentReplace: ReplaceInfo, periodIndexArgIndex: number) {
    const argText = currentReplace.args[0] || "";

    if (currentReplace.typeArgText.length > 0 && argText.length > 0 && (!currentReplace.showFull || periodIndexArgIndex === 1))
        return getFunctionText(argText);

    const typeArgText = currentReplace.typeArgText;
    const isNameofFullWithTypeParam = currentReplace.showFull && typeArgText.length > 0;

    if (argText.length > 0 && !isNameofFullWithTypeParam)
        return argText;

    const bracketIndex = typeArgText.indexOf("<");
    if (bracketIndex > 0)
        return typeArgText.substring(0, bracketIndex);

    return typeArgText;
}

function getPeriodIndexArgText(currentReplace: ReplaceInfo, argIndex: -1 | 0 | 1) {
    if (argIndex === -1 || argIndex >= currentReplace.args.length)
        return "";

    return currentReplace.args[argIndex];
}

function getPeriodIndexArgIndex(currentReplace: ReplaceInfo) {
    if (!currentReplace.showFull)
        return -1;

    if (currentReplace.args.length === 0)
        return 0;

    if (currentReplace.args.length === 1) {
        if (isNaN(parseInt(currentReplace.args[0], 10)))
            return 1;
        return 0;
    }

    if (currentReplace.args.length === 2 && !isNaN(parseInt(currentReplace.args[1], 10)))
        return 1;

    return -1;
}

function getFullText(text: string, periodIndexText: string) {
    return getRawText().replace(/!/g, "");

    function getRawText() {
        if (periodIndexText.length === 0)
            return text;

        const periodIndex = parseInt(periodIndexText, 10);
        if (isNaN(periodIndex))
            throw new Error(`periodIndex parameter "${periodIndexText}" of nameof.full must be a number literal (ex. 1, -1, 2, etc.).`);

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
}

function getFunctionText(text: string) {
    const startIndex = text.indexOf(".") + 1;
    const endIndex = getFunctionTextEndIndex(text);

    if (startIndex === 0)
        throw new Error(`Could not find period in provided function: ${text}`);

    return text.substring(startIndex, endIndex);
}

function getFunctionTextEndIndex(text: string) {
    let endIndex = text.length;
    const lastSemiColonIndex = text.lastIndexOf(";");
    const lastBraceIndex = text.lastIndexOf("}");

    if (lastSemiColonIndex > 0)
        endIndex = lastSemiColonIndex;

    if (lastBraceIndex > 0 && lastBraceIndex < endIndex)
        endIndex = lastBraceIndex;

    return endIndex;
}
