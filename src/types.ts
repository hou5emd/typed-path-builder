type Builder<T extends string = string> = { _build: () => T };

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
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
  T extends RouteConfig,
  K extends keyof T = keyof T,
  Path extends string = "",
> = Builder<Path> &
  UnionToIntersection<
    K extends "_queries"
      ? {
          readonly [M in K]: <
            V extends string,
            Queries extends { [Q in keyof T[M]]?: V },
          >(
            queries: Queries,
          ) => Builder<`${Path}?${keyof Queries extends infer Q ? (Q extends string | number ? `${Q}=${Queries[Q]}` : never) : never}`>;
        }
      : K extends `:${infer N}?`
        ? {
            readonly [M in N]: <Param extends string>(
              parameter?: Param,
            ) => RouteBuilder<T[K], keyof T[K], PathString<Path, Param>>;
          }
        : K extends `:${infer N}`
          ? {
              readonly [M in N]: <Param extends string>(
                parameter: Param,
              ) => RouteBuilder<T[K], keyof T[K], PathString<Path, Param>>;
            }
          : K extends string | number
            ? {
                readonly [M in K]: RouteBuilder<T[K], keyof T[K], PathString<Path, K>>;
              }
            : never
  >;

export type PathBuilder<
  Config extends RouteConfig,
  ConfigKey extends keyof Config = keyof Config,
  Path extends string = "/",
  RelativeToPath extends string = "",
> = Builder<Path> &
  UnionToIntersection<
    ConfigKey extends "_queries"
      ? never
      : ConfigKey extends `:${infer N}?`
        ? {
            readonly [M in N]: PathBuilder<
              Config[ConfigKey],
              keyof Config[ConfigKey],
              PathString<Path, ConfigKey, RelativeToPath>
            >;
          }
        : ConfigKey extends `:${infer N}`
          ? {
              readonly [M in N]: PathBuilder<
                Config[ConfigKey],
                keyof Config[ConfigKey],
                PathString<Path, ConfigKey, RelativeToPath>
              >;
            }
          : ConfigKey extends string | number
            ? {
                readonly [M in ConfigKey]: PathBuilder<
                  Config[ConfigKey],
                  keyof Config[ConfigKey],
                  PathString<Path, ConfigKey, RelativeToPath>
                >;
              }
            : never
  > &
  (Path extends "/"
    ? {
        relativeTo: <PB extends Builder>(
          base: PB,
        ) => PB extends Builder<infer BasePath>
          ? BasePath extends "/"
            ? PathBuilder<Config, ConfigKey, "", "/">
            : GetByPath<Config, BasePath> extends infer NewConfig
              ? NewConfig extends RouteConfig
                ? PathBuilder<NewConfig, keyof NewConfig, "", BasePath>
                : never
              : never
          : never;
      }
    : {});
