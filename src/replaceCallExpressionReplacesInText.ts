import {ReplaceInfo} from "./structures";

export function replaceCallExpressionReplacesInText(callExpressionReplaces: ReplaceInfo[], data: string) {
    for (let i = 0; i < callExpressionReplaces.length; i++) {
        const newText = `"${callExpressionReplaces[i].text.substr(callExpressionReplaces[i].text.lastIndexOf(".") + 1)}"`;
        const offset = newText.length - (callExpressionReplaces[i].end - callExpressionReplaces[i].pos);

        data = data.substring(0, callExpressionReplaces[i].pos) + newText + data.substring(callExpressionReplaces[i].end);

        for (let j = i + 1; j < callExpressionReplaces.length; j++) {
            callExpressionReplaces[j].pos += offset;
            callExpressionReplaces[j].end += offset;
        }
    }

    return data;
}
