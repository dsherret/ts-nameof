import {ReplaceInfo} from "./ReplaceInfo";

export function replaceCallExpressionReplacesInText(callExpressionReplaces: ReplaceInfo[], data: string) {
    for (let i = 0; i < callExpressionReplaces.length; i++) {
        let text: string;

        if (callExpressionReplaces[i].typeArgText) {
            text = callExpressionReplaces[i].typeArgText;
            const bracketIndex = text.indexOf("<");
            if (bracketIndex > 0) {
                text = text.substring(0, bracketIndex);
            }
        }
        else {
            text = callExpressionReplaces[i].argText;
        }

        const newText = `"${text.substr(text.lastIndexOf(".") + 1).trim()}"`;
        const offset = newText.length - (callExpressionReplaces[i].end - callExpressionReplaces[i].pos);

        data = data.substring(0, callExpressionReplaces[i].pos) + newText + data.substring(callExpressionReplaces[i].end);

        for (let j = i + 1; j < callExpressionReplaces.length; j++) {
            callExpressionReplaces[j].pos += offset;
            callExpressionReplaces[j].end += offset;
        }
    }

    return data;
}
