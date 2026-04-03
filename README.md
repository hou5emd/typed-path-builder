# typed-path-builder

Generate statically typed path and route builders from a simple config object. This is useful when working with routers such as `react-router`, where you want predefined URL structures without string typos.

[Русский](./README-ru.md)
[日本語](./README-ja.md)

## Usage

### Define config object

Define your URLs as an object.

For example, if your application has the following URLs:

```
/foo
/foo/:fooId
/foo/:fooId/bar
/fizz
/fizz/buzz/
/100
```

Prepare an object like the following and pass it to `createTypedPathBuilder` function.

```ts
import createTypedPathBuilder from "typed-path-builder";

const routeConfig = {
  foo: {
    ":fooId": {
      bar: {},
    },
  },
  fizz: {
    buzz: {},
  },
  100: {},
};

const [path, route] = createTypedPathBuilder(routeConfig);
```

Use an empty object (`{}`) for terminal segments. If you need path parameters, start the property name with `":"`.

### Path builder

The `path` object generates template paths from the config.

```ts
path.foo.fooId.bar.build() // => "/foo/:fooId/bar"
path.foo.fooId.bar.relativeTo(path.foo).build() // => ":fooId/bar"
```

`relativeTo(base)` returns only a builder, so it should be used directly before `.build()`.

### Route builder

The `route` object generates concrete routes from the config.
Properties that start with `":"`, such as `":fooId"`, become functions in the route builder.

```ts
route.foo.fooId("id").build() // => "/foo/id"
```

## Query parameters

To include query parameters, add a `_queries` property.

```ts
const withQueries = {
  foo: {
    ":fooId": {
      _queries: {
        param1: {},
        param2: {},
        param3: {},
      },
    },
  },
};

const [, route] = createTypedPathBuilder(withQueries);

route.foo.fooId("id")._queries({ param1: "value1", param3: "value3" }).build(); // => "/foo/id?param1=value1&param3=value3"
```

`_queries` becomes a function in the route builder and accepts a query parameter object in a type-safe way.
