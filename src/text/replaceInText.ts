import { StringIterator } from "./StringIterator";
import { NameOfFinder } from "./NameOfFinder";
import { replaceCallExpressionReplacesInText } from "./replaceCallExpressionReplacesInText";

export function replaceInText(fileText: string): { fileText?: string; replaced: boolean; } {
    const finder = new NameOfFinder(new StringIterator(fileText));
    const indexes = finder.indexOfAll();

    if (indexes.length === 0)
        return { replaced: false };

    return { fileText: replaceCallExpressionReplacesInText(indexes, fileText), replaced: true };
}
