type Builder<T extends string = string> = { _build: () => T };

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type QueryKey = string | number;
type SegmentKey = string | number;

type ChildConfig<Config extends RouteConfig, Key extends keyof Config> = Extract<
  Config[Key],
  RouteConfig
>;

type ChildKeys<Config extends RouteConfig, Key extends keyof Config> = keyof ChildConfig<
  Config,
  Key
>;

type RequiredParameterName<Key> = Key extends `:${infer Name}` ? Name : never;

type OptionalParameterName<Key> = Key extends `:${infer Name}?` ? Name : never;

type ParameterName<Key> = Key extends `:${string}?`
  ? OptionalParameterName<Key>
  : RequiredParameterName<Key>;

type IsOptionalParameter<Key> = Key extends `:${string}?` ? true : false;

type StaticSegment<Key> = Extract<Key, SegmentKey>;

type LastOfUnion<T extends QueryKey> =
  UnionToIntersection<T extends unknown ? (arg: T) => void : never> extends (
    arg: infer Last,
  ) => void
    ? Extract<Last, QueryKey>
    : never;

type UnionToTuple<T extends QueryKey, Last extends QueryKey = LastOfUnion<T>> = [
  T,
] extends [never]
  ? []
  : [...UnionToTuple<Exclude<T, Last>>, Last];

type AppendQueryPart<
  Current extends string,
  Key extends QueryKey,
  Value extends string,
> = Current extends "" ? `${Key}=${Value}` : `${Current}&${Key}=${Value}`;

type BuildQueryString<
  Keys extends readonly unknown[],
  Queries extends Partial<Record<QueryKey, string>>,
  Current extends string = "",
> = Keys extends [infer Key extends QueryKey, ...infer Rest]
  ? Key extends keyof Queries
    ? BuildQueryString<
        Rest,
        Queries,
        AppendQueryPart<Current, Key, Queries[Key] & string>
      >
    : BuildQueryString<Rest, Queries, Current>
  : Current;

type BuildPathWithQuery<
  Path extends string,
  Queries extends Partial<Record<QueryKey, string>>,
> =
  BuildQueryString<
    UnionToTuple<Extract<keyof Queries, QueryKey>>,
    Queries
  > extends infer Query extends string
    ? Query extends ""
      ? Path
      : `${Path}?${Query}`
    : never;

type GetByPath<
  T extends RouteConfig,
  P extends string,
> = P extends `/${infer Key}/${infer Rest}`
  ? Key extends keyof T
    ? GetByPath<T[Key], `/${Rest}`>
    : never
  : P extends `/${infer Key}`
    ? T[Key]
    : never;

type RelativeConfig<
  Config extends RouteConfig,
  BasePath extends string,
  ConfigKey extends keyof Config,
> = BasePath extends "/"
  ? PathBuilder<Config, ConfigKey, "", "/">
  : GetByPath<Config, BasePath> extends infer NextConfig
    ? NextConfig extends RouteConfig
      ? PathBuilder<NextConfig, keyof NextConfig, "", BasePath>
      : never
    : never;

type RouteQueryNode<
  Config extends RouteConfig,
  Path extends string,
> = "_queries" extends keyof Config
  ? {
      readonly _queries: <
        Value extends string,
        Queries extends { [Query in keyof Config["_queries"]]?: Value },
      >(
        queries: Queries,
      ) => Builder<BuildPathWithQuery<Path, Queries>>;
    }
  : never;

type RouteStaticChild<
  Config extends RouteConfig,
  Key extends keyof Config,
  Path extends string,
> = {
  readonly [Property in StaticSegment<Key>]: RouteBuilder<
    ChildConfig<Config, Key>,
    ChildKeys<Config, Key>,
    PathString<Path, StaticSegment<Key>>
  >;
};

type RouteParameterChild<
  Config extends RouteConfig,
  Key extends keyof Config,
  Path extends string,
  Parameter extends string = ParameterName<Key>,
> =
  IsOptionalParameter<Key> extends true
    ? {
        readonly [Property in Parameter]: <Param extends string>(
          parameter?: Param,
        ) => RouteBuilder<
          ChildConfig<Config, Key>,
          ChildKeys<Config, Key>,
          PathString<Path, Param>
        >;
      }
    : {
        readonly [Property in Parameter]: <Param extends string>(
          parameter: Param,
        ) => RouteBuilder<
          ChildConfig<Config, Key>,
          ChildKeys<Config, Key>,
          PathString<Path, Param>
        >;
      };

type RouteBuilderNode<
  Config extends RouteConfig,
  Key extends keyof Config,
  Path extends string,
> = Key extends "_queries"
  ? RouteQueryNode<Config, Path>
  : Key extends `:${string}`
    ? RouteParameterChild<Config, Key, Path>
    : Key extends SegmentKey
      ? RouteStaticChild<Config, Key, Path>
      : never;

type PathStaticChild<
  Config extends RouteConfig,
  Key extends keyof Config,
  Path extends string,
  RelativeToPath extends string,
  NextPath extends string = PathString<Path, StaticSegment<Key>, RelativeToPath>,
> = {
  readonly [Property in StaticSegment<Key>]: PathBuilder<
    ChildConfig<Config, Key>,
    ChildKeys<Config, Key>,
    NextPath,
    RelativeToPath
  >;
};

type PathParameterChild<
  Config extends RouteConfig,
  Key extends keyof Config,
  Path extends string,
  RelativeToPath extends string,
  Parameter extends string = ParameterName<Key>,
  NextPath extends string = PathString<Path, Key & SegmentKey, RelativeToPath>,
> = {
  readonly [Property in Parameter]: PathBuilder<
    ChildConfig<Config, Key>,
    ChildKeys<Config, Key>,
    NextPath,
    RelativeToPath
  >;
};

type PathBuilderNode<
  Config extends RouteConfig,
  Key extends keyof Config,
  Path extends string,
  RelativeToPath extends string,
> = Key extends "_queries"
  ? never
  : Key extends `:${string}`
    ? PathParameterChild<Config, Key, Path, RelativeToPath>
    : Key extends SegmentKey
      ? PathStaticChild<Config, Key, Path, RelativeToPath>
      : never;

type RelativeToNode<
  Config extends RouteConfig,
  ConfigKey extends keyof Config,
  Path extends string,
> = Path extends "/"
  ? {
      relativeTo: <PB extends Builder>(
        base: PB,
      ) => PB extends Builder<infer BasePath extends string>
        ? RelativeConfig<Config, BasePath, ConfigKey>
        : never;
    }
  : {};

export type RouteConfig<
  DeepLength extends number = 50,
  DeepLengthArr extends number[] = [0],
> = DeepLengthArr["length"] extends DeepLength
  ? never
  : {
      [Path in string | number]: Path extends "_queries"
        ? {}
        : RouteConfig<DeepLength, [0, ...DeepLengthArr]>;
    };

export type PathString<
  Current extends string | number,
  NextPath extends string | number,
  RelativeTo extends string | number = "",
> = RelativeTo extends ""
  ? Current extends "/"
    ? `/${NextPath}`
    : `${Current}/${NextPath}`
  : Current extends "/"
    ? `${NextPath}`
    : `${Current}/${NextPath}` extends `${RelativeTo}${infer Rest}`
      ? Rest
      : Current extends ""
        ? `${NextPath}`
        : `${Current}/${NextPath}`;

export type RouteBuilder<
  Config extends RouteConfig,
  ConfigKey extends keyof Config = keyof Config,
  Path extends string = "",
> = Builder<Path> &
  UnionToIntersection<
    ConfigKey extends keyof Config ? RouteBuilderNode<Config, ConfigKey, Path> : never
  >;

export type PathBuilder<
  Config extends RouteConfig,
  ConfigKey extends keyof Config = keyof Config,
  Path extends string = "/",
  RelativeToPath extends string = "",
> = Builder<Path> &
  UnionToIntersection<
    ConfigKey extends keyof Config
      ? PathBuilderNode<Config, ConfigKey, Path, RelativeToPath>
      : never
  > &
  RelativeToNode<Config, ConfigKey, Path>;
