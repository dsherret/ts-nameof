import { runTest as runTest1 } from "./replaceInTextTestMethod";
import { runTest as runTest2 } from "./transformationTestMethod";

const testMethods = [{ name: "replaceInText", runTest: runTest1 }, { name: "transformation", runTest: runTest2 }];

export function runTestOnAllMethods(runTest: (method: (text: string, expected: string) => void) => void) {
    for (const testMethod of testMethods) {
        describe(testMethod.name, () => {
            runTest(testMethod.runTest);
        });
    }
}
