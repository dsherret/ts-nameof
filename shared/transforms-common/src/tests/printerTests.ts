import * as assert from "assert";
import * as printers from "../printers";
import * as factories from "../node-factories";
import { NameofCallExpression, Node } from "../nodes";

describe("printCallExpression", () => {
    function doTest(callExpr: NameofCallExpression, expectedText: string) {
        const result = printers.printCallExpression(callExpr);
        assert.equal(result, expectedText);
    }

    it("should print a basic call expression", () => {
        doTest({
            property: undefined,
            typeArguments: [],
            arguments: []
        }, "nameof()");
    });

    it("should print with a property", () => {
        doTest({
            property: "full",
            typeArguments: [],
            arguments: []
        }, "nameof.full()");
    });

    it("should print with an argument", () => {
        doTest({
            property: undefined,
            typeArguments: [],
            arguments: [factories.createIdentifierNode("test")]
        }, "nameof(test)");
    });

    it("should print with arguments", () => {
        doTest({
            property: undefined,
            typeArguments: [],
            arguments: [
                factories.createIdentifierNode("test1"),
                factories.createIdentifierNode("test2")
            ]
        }, "nameof(test1, test2)");
    });

    it("should print with a type argument", () => {
        doTest({
            property: undefined,
            typeArguments: [factories.createIdentifierNode("T")],
            arguments: []
        }, "nameof<T>()");
    });

    it("should print with type arguments", () => {
        doTest({
            property: undefined,
            typeArguments: [
                factories.createIdentifierNode("T"),
                factories.createIdentifierNode("U")
            ],
            arguments: []
        }, "nameof<T, U>()");
    });

    it("should print with everything", () => {
        doTest({
            property: "full",
            typeArguments: [
                factories.createIdentifierNode("T"),
                factories.createIdentifierNode("U")
            ],
            arguments: [
                factories.createIdentifierNode("test1"),
                factories.createIdentifierNode("test2")
            ]
        }, "nameof.full<T, U>(test1, test2)");
    });
});

describe("printNode", () => {
    function doTest(node: Node, expectedText: string) {
        const result = printers.printNode(node);
        assert.equal(result, expectedText);
    }

    describe("identifier", () => {
        it("should print an identifier", () => {
            doTest(factories.createIdentifierNode("Test"), "Test");
        });

        it("should print the next identifier separated by a period", () => {
            doTest(factories.createIdentifierNode("Test", factories.createIdentifierNode("Next")), "Test.Next");
        });

        it("should print the next computed value with no separation", () => {
            const node = factories.createIdentifierNode("Test",
                factories.createComputedNode(factories.createStringLiteralNode("prop")));
            doTest(node, `Test["prop"]`);
        });
    });

    describe("string literal", () => {
        it("should print in quotes", () => {
            doTest(factories.createStringLiteralNode("test"), `"test"`);
        });

        it("should print with a property after", () => {
            const node = factories.createStringLiteralNode("test",
                factories.createIdentifierNode("length"));
            doTest(node, `"test".length`);
        });
    });

    describe("numeric literal", () => {
        it("should print", () => {
            doTest(factories.createNumericLiteralNode(5), `5`);
        });

        it("should print with a property after", () => {
            const node = factories.createNumericLiteralNode(5,
                factories.createIdentifierNode("length"));
            doTest(node, `5.length`);
        });
    });

    describe("computed", () => {
        it("should print inside brackets", () => {
            const node = factories.createComputedNode(factories.createStringLiteralNode("test"));
            doTest(node, `["test"]`);
        });

        it("should print with a property after", () => {
            const node = factories.createComputedNode(factories.createNumericLiteralNode(5),
                factories.createIdentifierNode("length"));
            doTest(node, `[5].length`);
        });
    });

    describe("function", () => {
        it("should print with no arguments", () => {
            const node = factories.createFunctionNode(factories.createNumericLiteralNode(5), []);
            doTest(node, `() => 5`);
        });

        it("should print with an argument", () => {
            const node = factories.createFunctionNode(factories.createNumericLiteralNode(5), ["p"]);
            doTest(node, `(p) => 5`); // keep it simple (don't bother removing parens)
        });

        it("should print with arguments", () => {
            const node = factories.createFunctionNode(factories.createNumericLiteralNode(5), ["a", "b"]);
            doTest(node, `(a, b) => 5`);
        });

        it("should print with a property after", () => {
            const node = factories.createFunctionNode(factories.createNumericLiteralNode(5), ["a", "b"],
                factories.createIdentifierNode("length"));
            doTest(node, `((a, b) => 5).length`);
        });
    });

    describe("array", () => {
        it("should print the array with no elements", () => {
            const node = factories.createArrayLiteralNode([]);
            doTest(node, "[]");
        });

        it("should print the array with one element", () => {
            const node = factories.createArrayLiteralNode([factories.createStringLiteralNode("test")]);
            doTest(node, `["test"]`);
        });

        it("should print the array with multiple elements", () => {
            const node = factories.createArrayLiteralNode([factories.createStringLiteralNode("test"), factories.createStringLiteralNode("test2")]);
            doTest(node, `["test", "test2"]`);
        });

        it("should print with a property after", () => {
            const node = factories.createArrayLiteralNode([], factories.createIdentifierNode("length"));
            doTest(node, `[].length`);
        });
    });
});
