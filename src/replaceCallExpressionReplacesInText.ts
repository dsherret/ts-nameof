import {ReplaceInfo} from "./ReplaceInfo";

export function replaceCallExpressionReplacesInText(callExpressionReplaces: ReplaceInfo[], data: string) {
    for (let i = 0; i < callExpressionReplaces.length; i++) {
        let text: string;
        const currentReplace = callExpressionReplaces[i];

        if (currentReplace.argText.length > 0)
            text = currentReplace.argText;
        else {
            text = currentReplace.typeArgText;
            const bracketIndex = text.indexOf("<");
            if (bracketIndex > 0)
                text = text.substring(0, bracketIndex);
        }

        const newText = (currentReplace.showFull ? `"${text}"` : `"${getParenText(text)}"`).replace(/ /g, "");
        const offset = newText.length - (currentReplace.end - currentReplace.pos);

        data = data.substring(0, currentReplace.pos) + newText + data.substring(currentReplace.end);

        for (let j = i + 1; j < callExpressionReplaces.length; j++) {
            callExpressionReplaces[j].pos += offset;
            callExpressionReplaces[j].end += offset;
        }
    }

    return data;
}

function getParenText(text: string) {
    const startIndex = text.lastIndexOf(".") + 1;
    let endIndex = text.length;
    const lastSemiColonIndex = text.lastIndexOf(";");
    const lastBraceIndex = text.lastIndexOf("}");

    if (lastSemiColonIndex > 0) {
        endIndex = lastSemiColonIndex;
    }

    if (lastBraceIndex > 0 && lastBraceIndex < endIndex) {
        endIndex = lastBraceIndex;
    }

    return text.substring(startIndex, endIndex);
}
