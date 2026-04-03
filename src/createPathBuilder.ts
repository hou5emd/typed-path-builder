import { PathBuilder, RouteConfig } from "./types";
import * as lib from "./lib";

export function createPathBuilder<T extends RouteConfig>(config: T): PathBuilder<T> {
  return new PathBuilderImpl("", config, false) as any;
}

export class PathBuilderImpl {
  readonly relativeTo?: (base: PathBuilderImpl) => PathBuilderImpl;

  constructor(
    private path: string,
    private config: RouteConfig,
    private isRelative: boolean,
  ) {
    if (!this.isRelative && this.path === "") {
      this.relativeTo = base => new PathBuilderImpl("", base.config, true);
    }

    const entries = Object.entries(config);

    entries.forEach(([key, value]) => {
      const nextPath = this.createChildPath(key);
      Object.assign(this, {
        [lib.trimColon(key)]: new PathBuilderImpl(nextPath, value, this.isRelative),
      });
    });
  }

  _build(): string {
    if (this.path !== "") {
      return this.path;
    }

    return this.isRelative ? "" : "/";
  }

  private createChildPath(segment: string): string {
    if (this.path === "") {
      return this.isRelative ? segment : `/${segment}`;
    }

    return `${this.path}/${segment}`;
  }
}
