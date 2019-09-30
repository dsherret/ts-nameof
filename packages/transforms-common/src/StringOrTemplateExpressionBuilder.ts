import { InterpolateNode, StringLiteralNode, TemplateExpressionNode } from "./nodes";
import { createStringLiteralNode, createTemplateExpressionNode } from "./nodeFactories";

/**
 * Builds up a string that will be a string literal if able, but will change to a template
 * expression if necessary.
 */
export class StringOrTemplateExpressionNodeBuilder {
    private text: string | undefined = "";
    private items: (string | InterpolateNode)[] = [];

    hasText() {
        return this.text != null && this.text.length > 0 || this.items.length > 0;
    }

    buildNode(): StringLiteralNode | TemplateExpressionNode {
        if (this.text != null)
            return createStringLiteralNode(this.text);
        return createTemplateExpressionNode(this.items);
    }

    addItem(item: string | InterpolateNode | StringLiteralNode | TemplateExpressionNode) {
        if (typeof item === "string")
            this.addText(item);
        else if (item.kind === "StringLiteral")
            this.addText(item.value);
        else if (item.kind === "TemplateExpression") {
            for (const part of item.parts)
                this.addItem(part);
        }
        else {
            this.addInterpolate(item);
        }
    }

    addText(newText: string) {
        if (this.text == null) {
            if (typeof this.items[this.items.length - 1] === "string")
                this.items[this.items.length - 1] += newText;
            else
                this.items.push(newText);
        }
        else {
            this.text += newText;
        }
    }

    private addInterpolate(interpolate: InterpolateNode) {
        if (this.text != null) {
            this.items.push(this.text);
            this.text = undefined;
        }
        this.items.push(interpolate);
    }
}
