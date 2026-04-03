# typed-path-builder

Генерирует типизированные path- и route-builder'ы из простого config object. Это удобно при работе с роутерами вроде `react-router`, когда хочется описывать URL один раз и дальше не собирать строки вручную.

Этот проект является форком [y-hiraoka/typed-path-builder](https://github.com/y-hiraoka/typed-path-builder).

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
path.foo.fooId.bar._build(); // => "/foo/:fooId/bar"
path.relativeTo(path.foo).fooId.bar._build(); // => ":fooId/bar"
```

`relativeTo(base)` собирает путь относительно `base`, поэтому после него доступны только потомки `base`.

### Route builder

Объект `route` генерирует конкретные маршруты на основе config.
Свойства, которые начинаются с `":"`, например `":fooId"`, в route builder становятся функциями.

```ts
route.foo.fooId("id")._build(); // => "/foo/id"
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

route.foo.fooId("id")._queries({ param1: "value1", param3: "value3" })._build(); // => "/foo/id?param1=value1&param3=value3"
```

`_queries` становится функцией в route builder и типобезопасно принимает объект query-параметров.
