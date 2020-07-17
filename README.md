# ts-nameof

[![Build Status](https://travis-ci.org/dsherret/ts-nameof.svg)](https://travis-ci.org/dsherret/ts-nameof)

[`nameof`](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/nameof) in TypeScript.

Monorepo for ts-nameof projects:

- [ts-nameof](packages/ts-nameof) (TypeScript compiler)
- [babel-plugin-ts-nameof](packages/babel-plugin-ts-nameof) (Babel compiler)
- [ts-nameof.macro](packages/ts-nameof.macro) (Babel compiler)

## Setup

ts-nameof is a _compile time transform_ so it requires some setup. For setup instructions, see the packages above for the compiler you use.

## nameof transform

### `nameof(...)`

```ts
nameof(console);
nameof(console.log);
nameof(console["warn"]);
```

Transforms to:

```ts
"console";
"log";
"warn";
```

### `nameof<T>()`

```ts
nameof<MyInterface>();
nameof<Array<MyInterface>>();
nameof<MyNamespace.MyInnerInterface>();
```

Transforms to:

```ts
"MyInterface";
"Array";
"MyInnerInterface";
```

This is useful when working in the type domain.

### `nameof<T>(o => ...)`

```ts
nameof<MyInterface>(o => o.prop);
```

Transforms to:

```ts
"prop";
```

## nameof.full transform

### `nameof.full(...)`

```ts
nameof.full(console.log);
nameof.full(window.alert.length, 1);
nameof.full(window.alert.length, 2);
nameof.full(window.alert.length, -1);
nameof.full(window.alert.length, -2);
nameof.full(window.alert.length, -3);
```

Transforms to:

```ts
"console.log";
"alert.length";
"length";
"length";
"alert.length";
"window.alert.length";
```

### `nameof.full<T>()`

```ts
nameof.full<MyNamespace.MyInnerInterface>();
nameof.full<MyNamespace.MyInnerInterface>(1);
nameof.full<Array<MyInterface>>();
```

Transforms to:

```ts
"MyNamespace.MyInnerInterface";
"MyInnerInterface";
"Array";
```

### `nameof.full<T>(o => ...)`

```ts
nameof.full<MyInterface>(o => o.prop.prop2);
nameof.full<MyInterface>(o => o.prop.prop2.prop3, 1);
```

Transforms to:

```ts
"prop.prop2";
"prop2.prop3";
```

### `nameof.interpolate(value)`

Writing the following:

```ts
nameof.full(myObj.prop[i]);
```

...does not interpolate the node in the computed property.

```ts
"myObj.prop[i]";
```

If you want to interpolate the value then you can specify that explicitly with a `nameof.interpolate` function.

```ts
nameof.full(myObj.prop[nameof.interpolate(i)]);
```

Transforms to:

```ts
`myObj.prop[${i}]`;
```

## nameof.toArray transform

Contributed by: [@cecilyth](https://github.com/cecilyth)

### `nameof.toArray(...)`

```ts
nameof.toArray(myObject, otherObject);
nameof.toArray(obj.firstProp, obj.secondProp, otherObject, nameof.full(obj.other));
```

Transforms to:

```ts
["myObject", "otherObject"];
["firstProp", "secondProp", "otherObject", "obj.other"];
```

### `nameof.toArray<T>(o => [...])`

```ts
nameof.toArray<MyType>(o => [o.firstProp, o.otherProp.secondProp, o.other]);
nameof.toArray<MyType>(o => [o.prop, nameof.full(o.myProp.otherProp, 1)]);
```

Transforms to:

```ts
["firstProp", "secondProp", "other"];
["prop", "myProp.otherProp"];
```

## nameof.split transform

Contributed by: [@cecilyth](https://github.com/cecilyth)

### `nameof.split(...)`

```ts
nameof.split(myObj.prop.prop2);
nameof.split(myObj.prop.prop2, 1);
nameof.split(myObj.prop.prop2, -1);
nameof.split(myObj.prop.prop2).join("/");
```

Transforms to:

```ts
["myObj", "prop", "prop2"];
["prop", "prop2"];
["prop2"];
["myObj", "prop", "prop2"].join("/"); // "myObj/prop/prop2"
```

### `nameof.split<T>(o => ...)`

```ts
nameof.split<MyInterface>(o => o.prop.prop2.prop3);
nameof.split<MyInterface>(o => o.prop.prop2.prop3, 1);
nameof.split<MyInterface>(o => o.prop.prop2.prop3, -1);
nameof.split<IState>(s => s.a.b.c).join("/");
```

Transforms to:

```ts
["prop", "prop2", "prop3"];
["prop2", "prop3"];
["prop3"];
["a", "b", "c"].join("/"); // "a/b/c"
```

## Other

- [Contributing](CONTRIBUTING.md)
- [Development](DEVELOPMENT.md)
