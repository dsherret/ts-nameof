ts-nameof
==========

[![Build Status](https://travis-ci.org/dsherret/ts-nameof.svg)](https://travis-ci.org/dsherret/ts-nameof)

[`nameof`](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/nameof) in TypeScript.

Monorepo for ts-nameof projects:

* [ts-nameof](packages/ts-nameof) (TypeScript compiler)
* [babel-plugin-ts-nameof](packages/babel-plugin-ts-nameof) (Babel compiler)
* [ts-nameof.macro](packages/ts-nameof.macro) (Babel compiler)

## nameof transform

### `nameof(...)`

```ts
nameof(console);
nameof(console.log);
```

Transforms to:

```ts
"console";
"log";
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

## Other

* [Contributing](CONTRIBUTING.md)
* [Development](DEVELOPMENT.md)
