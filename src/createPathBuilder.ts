import { PathBuilder, RouteConfig } from "./types";
import * as lib from "./lib";

export function createPathBuilder<T extends RouteConfig>(config: T): PathBuilder<T> {
  return new PathBuilderImpl("", config) as any;
}

export class PathBuilderImpl {
  constructor(
    private path: string,
    config: RouteConfig,
  ) {
    const entries = Object.entries(config);

    entries.forEach(([key, value]) => {
      // @ts-ignore
      this[lib.trimColon(key)] = new PathBuilderImpl(path + "/" + key, value);
    });
  }

  build(): string {
    return this.path === "" ? "/" : this.path;
  }

  relativeTo(base: { build(): string }): { build(): string } {
    return {
      build: () => {
        const targetPath = this.build();
        const basePath = base.build();

        if (targetPath === basePath) {
          return "";
        }

        if (basePath === "/") {
          return targetPath.slice(1);
        }

        const relativePrefix = `${basePath}/`;

        if (!targetPath.startsWith(relativePrefix)) {
          throw new Error(
            `Cannot build relative path from "${basePath}" to "${targetPath}" because the base path is not an ancestor of the target path.`,
          );
        }

        return targetPath.slice(relativePrefix.length);
      },
    };
  }
}
