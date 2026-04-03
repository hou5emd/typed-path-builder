export type RouteConfig<
  DeepLength extends number = 50,
  DeepLengthArr extends number[] = [0],
> = DeepLengthArr["length"] extends DeepLength
  ? never
  : { [path in string | number]: RouteConfig<DeepLength, [0, ...DeepLengthArr]> };

type QueryArgs<T extends Query> = { [K in keyof T]?: string };

type Query = { [path in string | number]: {} };

type Builder<T extends string = string> = { _build: () => T };
type AppendAbsolutePath<
  Path extends string,
  Segment extends string | number,
> = Path extends "/" ? `/${Segment}` : `${Path}/${Segment}`;
type AppendRelativePath<
  Path extends string,
  Segment extends string | number,
> = Path extends "" ? `${Segment}` : `${Path}/${Segment}`;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type _RouteBuilder<
  Config extends RouteConfig,
  Key extends keyof Config = keyof Config,
  DeepLength extends number = 50,
  DeepLengthArr extends number[] = [0],
> = DeepLengthArr["length"] extends DeepLength
  ? never
  : Key extends "_queries"
    ? {
        readonly [M in Key]: (queries: QueryArgs<Config[Key]>) => Builder;
      }
    : Key extends `:${infer N}`
      ? {
          readonly [M in N]: (parameter: string) => {
            [K in keyof (Builder &
              UnionToIntersection<
                _RouteBuilder<
                  Config[Key],
                  keyof Config[Key],
                  DeepLength,
                  [0, ...DeepLengthArr]
                >
              >)]: (Builder &
              UnionToIntersection<
                _RouteBuilder<
                  Config[Key],
                  keyof Config[Key],
                  DeepLength,
                  [0, ...DeepLengthArr]
                >
              >)[K];
          };
        }
      : {
          readonly [M in Key]: {
            [K in keyof (Builder &
              UnionToIntersection<
                _RouteBuilder<
                  Config[Key],
                  keyof Config[Key],
                  DeepLength,
                  [0, ...DeepLengthArr]
                >
              >)]: (Builder &
              UnionToIntersection<
                _RouteBuilder<
                  Config[Key],
                  keyof Config[Key],
                  DeepLength,
                  [0, ...DeepLengthArr]
                >
              >)[K];
          };
        };

export type RouteBuilder<T extends RouteConfig> = Builder &
  UnionToIntersection<_RouteBuilder<T>>;

type _AbsolutePathBuilder<
  Config extends RouteConfig,
  Key extends keyof Config = keyof Config,
  Path extends string = "/",
  DeepLength extends number = 50,
  DeepLengthArr extends number[] = [0],
> = DeepLengthArr["length"] extends DeepLength
  ? never
  : Key extends "_queries"
    ? never
    : Key extends `:${infer N}`
      ? {
          readonly [M in N]: AbsolutePathNode<
            AppendAbsolutePath<Path, Key>,
            Config[Key],
            DeepLength,
            [0, ...DeepLengthArr]
          >;
        }
      : Key extends string | number
        ? {
            readonly [M in Key]: AbsolutePathNode<
              AppendAbsolutePath<Path, Key>,
              Config[Key],
              DeepLength,
              [0, ...DeepLengthArr]
            >;
          }
        : never;

type _RelativePathBuilder<
  Config extends RouteConfig,
  Key extends keyof Config = keyof Config,
  Path extends string = "",
  DeepLength extends number = 50,
  DeepLengthArr extends number[] = [0],
> = DeepLengthArr["length"] extends DeepLength
  ? never
  : Key extends "_queries"
    ? never
    : Key extends `:${infer N}`
      ? {
          readonly [M in N]: RelativePathNode<
            AppendRelativePath<Path, Key>,
            Config[Key],
            DeepLength,
            [0, ...DeepLengthArr]
          >;
        }
      : Key extends string | number
        ? {
            readonly [M in Key]: RelativePathNode<
              AppendRelativePath<Path, Key>,
              Config[Key],
              DeepLength,
              [0, ...DeepLengthArr]
            >;
          }
        : never;

type AbsolutePathNode<
  Path extends string,
  Config extends RouteConfig,
  DeepLength extends number = 50,
  DeepLengthArr extends number[] = [0],
> = Builder<Path> &
  UnionToIntersection<
    _AbsolutePathBuilder<Config, keyof Config, Path, DeepLength, DeepLengthArr>
  >;

type RelativePathNode<
  Path extends string,
  Config extends RouteConfig,
  DeepLength extends number = 50,
  DeepLengthArr extends number[] = [0],
> = Builder<Path> &
  UnionToIntersection<
    _RelativePathBuilder<Config, keyof Config, Path, DeepLength, DeepLengthArr>
  >;

export type PathBuilder<Config extends RouteConfig> = AbsolutePathNode<"/", Config> & {
  relativeTo: <
    BasePath extends string,
    BaseConfig extends RouteConfig,
    DeepLength extends number = 50,
    DeepLengthArr extends number[] = [0],
  >(
    base: AbsolutePathNode<BasePath, BaseConfig, DeepLength, DeepLengthArr>,
  ) => RelativePathNode<"", BaseConfig, DeepLength, DeepLengthArr>;
};
