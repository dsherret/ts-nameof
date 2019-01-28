/// <reference path="./global.d.ts" />
/* tslint:disable */
namespace TestNamespace {
    export interface TestType {
        prop: string;
    }
}

class TestClass {
    prop: string;
}

// nameof tests
nameof(TestClass);
nameof<TestNamespace.TestType>();
nameof<TestClass>(t => t.prop);

// nameof.full tests
const testInstance = new TestClass();
nameof.full(testInstance.prop);
nameof.full(testInstance.prop, 1);
nameof.full<TestNamespace.TestType>();
nameof.full<TestNamespace.TestType>(1);
nameof.full<TestClass>(t => t.prop);
nameof.full<TestClass>(t => t.prop, 1);

// reference type test
const myObj = { test: "" };
nameof(myObj);
nameof.full(myObj);

// primitive type test
const myStr = "";
nameof(myStr);
nameof.full(myStr);

// null test
const nullTypedVar = null;
nameof(nullTypedVar);
nameof.full(nullTypedVar);

// undefined test
const undefinedTypedVar = undefined;
nameof(undefinedTypedVar);
nameof.full(undefinedTypedVar);
