import * as replaceInTextTestMethod from "./replaceInTextTestMethod";
import * as transformationTestMethod from "./transformationTestMethod";

const testMethods = [
    { name: "replaceInText", ...replaceInTextTestMethod },
    { name: "transformation", ...transformationTestMethod }
];

export function runTestOnAllMethods(runTest: (method: (text: string, expected: string) => void, throwTestMethod: (text: string) => void) => void) {
    for (const testMethod of testMethods) {
        describe(testMethod.name, () => {
            runTest(testMethod.runTest, testMethod.runThrowTest);
        });
    }
}
