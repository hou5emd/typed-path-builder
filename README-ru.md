# typed-path-builder

Генерирует типизированные path- и route-builder'ы из простого config object. Это удобно при работе с роутерами вроде `react-router`, когда хочется описывать URL один раз и дальше не собирать строки вручную.

[English](./README.md)
[日本語](./README-ja.md)

## Использование

### Определение config object

Опишите URL как объект.

Например, если в приложении есть такие маршруты:

```
/foo
/foo/:fooId
/foo/:fooId/bar
/fizz
/fizz/buzz/
/100
```

Подготовьте объект такого вида и передайте его в `createTypedPathBuilder`.

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

Для конечных сегментов используйте пустой объект (`{}`). Если нужен path parameter, имя свойства на этом уровне должно начинаться с `":"`.

### Path builder

Объект `path` генерирует шаблонные пути на основе config.

```ts
path.foo.fooId.bar.build() // => "/foo/:fooId/bar"
path.foo.fooId.bar.relativeTo(path.foo).build() // => ":fooId/bar"
```

`relativeTo(base)` возвращает только builder, поэтому использовать его нужно непосредственно перед `.build()`.

### Route builder

Объект `route` генерирует конкретные маршруты на основе config.
Свойства, которые начинаются с `":"`, например `":fooId"`, в route builder становятся функциями.

```ts
route.foo.fooId("id").build() // => "/foo/id"
```

## Query parameters

Если нужны query-параметры, добавьте свойство `_queries`.

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

`_queries` становится функцией в route builder и типобезопасно принимает объект query-параметров.
