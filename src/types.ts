export type RouteConfig<
  DeepLength extends number = 100,
  DeepLengthArr extends number[] = [0],
> = DeepLengthArr["length"] extends DeepLength
  ? never
  : { [path in string | number]: RouteConfig<DeepLength, [0, ...DeepLengthArr]> };

type QueryArgs<T extends Query> = { [K in keyof T]?: string };

type Query = { [path in string | number]: {} };

type Builder<T extends string = string> = { build: () => T };

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type _RouteBuilder<
  Config extends RouteConfig,
  Key extends keyof Config = keyof Config,
  DeepLength extends number = 100,
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

type _PathBuilder<
  Config extends RouteConfig,
  Key extends keyof Config = keyof Config,
  Path extends string = "",
  DeepLength extends number = 100,
  DeepLengthArr extends number[] = [0],
> = DeepLengthArr["length"] extends DeepLength
  ? never
  : Key extends "_queries"
    ? never
    : Key extends `:${infer N}`
      ? {
          readonly [M in N]: {
            [K in keyof (Builder<`${Path}/${Key}`> &
              UnionToIntersection<
                _PathBuilder<
                  Config[Key],
                  keyof Config[Key],
                  `${Path}/${Key}`,
                  DeepLength,
                  [0, ...DeepLengthArr]
                >
              >)]: (Builder<`${Path}/${Key}`> &
              UnionToIntersection<
                _PathBuilder<
                  Config[Key],
                  keyof Config[Key],
                  `${Path}/${Key}`,
                  DeepLength,
                  [0, ...DeepLengthArr]
                >
              >)[K];
          };
        }
      : Key extends string | number
        ? {
            readonly [M in Key]: {
              [K in keyof (Builder<`${Path}/${Key}`> &
                UnionToIntersection<
                  _PathBuilder<
                    Config[Key],
                    keyof Config[Key],
                    `${Path}/${Key}`,
                    DeepLength,
                    [0, ...DeepLengthArr]
                  >
                >)]: (Builder<`${Path}/${Key}`> &
                UnionToIntersection<
                  _PathBuilder<
                    Config[Key],
                    keyof Config[Key],
                    `${Path}/${Key}`,
                    DeepLength,
                    [0, ...DeepLengthArr]
                  >
                >)[K];
            };
          }
        : never;

export type PathBuilder<Config extends RouteConfig> = Builder<"/"> &
  UnionToIntersection<_PathBuilder<Config>>;
