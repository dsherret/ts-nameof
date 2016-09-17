import {ReplaceInfo} from "./ReplaceInfo";

export function replaceCallExpressionReplacesInText(callExpressionReplaces: ReplaceInfo[], data: string) {
    for (let i = 0; i < callExpressionReplaces.length; i++) {
        let text: string;
        const currentReplace = callExpressionReplaces[i];

        if (currentReplace.typeArgText) {
            text = currentReplace.typeArgText;
            const bracketIndex = text.indexOf("<");
            if (bracketIndex > 0) {
                text = text.substring(0, bracketIndex);
            }
        }
        else {
            text = currentReplace.argText;
        }

        const newText = currentReplace.showFull ? `"${text}"` : `"${text.substr(text.lastIndexOf(".") + 1).trim()}"`;
        const offset = newText.length - (currentReplace.end - currentReplace.pos);

        data = data.substring(0, currentReplace.pos) + newText + data.substring(currentReplace.end);

        for (let j = i + 1; j < callExpressionReplaces.length; j++) {
            callExpressionReplaces[j].pos += offset;
            callExpressionReplaces[j].end += offset;
        }
    }

    return data;
}
