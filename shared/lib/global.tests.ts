/// <reference path="./global.d.ts" />
/* tslint:disable */
namespace TestNamespace {
    export interface TestType {
        prop: string;
    }
}

class TestClass {
    prop1: string;
    prop2: string;
}

// nameof tests
nameof(TestClass);
nameof<TestNamespace.TestType>();
nameof<TestClass>(t => t.prop1);

// nameof.full tests
const testInstance = new TestClass();
nameof.full(testInstance.prop1);
nameof.full(testInstance.prop1, 1);
nameof.full<TestNamespace.TestType>();
nameof.full<TestNamespace.TestType>(1);
nameof.full<TestClass>(t => t.prop1);
nameof.full<TestClass>(t => t.prop1, 1);

// nameof.toArray tests
nameof.toArray(testInstance.prop1);
nameof.toArray(testInstance.prop1, testInstance.prop2);
nameof.toArray<TestClass>(t => [t.prop1]);

// reference type test
const myObj = { test: "" };
nameof(myObj);
nameof.full(myObj);
nameof.toArray(myObj);

// primitive type test
const myStr = "";
nameof(myStr);
nameof.full(myStr);
nameof.toArray(myStr);

// null test
const nullTypedVar = null;
nameof(nullTypedVar);
nameof.full(nullTypedVar);
nameof.toArray(nullTypedVar);

// undefined test
const undefinedTypedVar = undefined;
nameof(undefinedTypedVar);
nameof.full(undefinedTypedVar);
nameof.toArray(undefinedTypedVar);
