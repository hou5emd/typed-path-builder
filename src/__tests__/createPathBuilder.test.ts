import { createPathBuilder } from "../createPathBuilder";

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

const routeConfig = {
  users: {
    ":userId": {
      tweets: {
        ":tweetId": {
          likes: {},
          retweets: {},
        },
      },
      likes: {},
    },
  },
  settings: {
    security: {},
    privacies: {},
  },
  1: { 2: { 3: { 4: { 5: {} } } } },
};

const typedPath = createPathBuilder(routeConfig);
const typedRelativeRoot = typedPath.relativeTo(typedPath.users.userId);
const typedRelativePath = typedRelativeRoot.tweets.tweetId.likes;

type RootPath = ReturnType<typeof typedPath._build>;
type UsersPath = ReturnType<typeof typedPath.users._build>;
type RelativeRootPath = ReturnType<typeof typedRelativeRoot._build>;
type NestedRelativePath = ReturnType<typeof typedRelativePath._build>;

const rootPathTypecheck: Expect<Equal<RootPath, "/">> = true;
const usersPathTypecheck: Expect<Equal<UsersPath, "/users">> = true;
const relativeRootPathTypecheck: Expect<Equal<RelativeRootPath, "">> = true;
const nestedRelativePathTypecheck: Expect<
  Equal<NestedRelativePath, "tweets/:tweetId/likes">
> = true;

// @ts-expect-error settings is outside the selected relative subtree
typedPath.relativeTo(typedPath.users.userId).settings;
// @ts-expect-error relativeTo is available only on the root path builder
type NestedRelativeTo = typeof typedPath.users.relativeTo;

test("createPathBuilder", () => {
  const path = typedPath;

  expect(path._build()).toBe("/");
  expect(path.users._build()).toBe("/users");
  expect(path.users.userId._build()).toBe("/users/:userId");
  expect(path.users.userId.tweets._build()).toBe("/users/:userId/tweets");
  expect(path.users.userId.tweets.tweetId._build()).toBe(
    "/users/:userId/tweets/:tweetId",
  );
  expect(path.users.userId.tweets.tweetId.likes._build()).toBe(
    "/users/:userId/tweets/:tweetId/likes",
  );
  expect(path.users.userId.tweets.tweetId.retweets._build()).toBe(
    "/users/:userId/tweets/:tweetId/retweets",
  );
  expect(path.users.userId.likes._build()).toBe("/users/:userId/likes");
  expect(path.settings._build()).toBe("/settings");
  expect(path.settings.security._build()).toBe("/settings/security");
  expect(path.settings.privacies._build()).toBe("/settings/privacies");
  expect(path[1][2][3][4][5]._build()).toBe("/1/2/3/4/5");

  expect(path.relativeTo(path.users.userId).tweets.tweetId.likes._build()).toBe(
    "tweets/:tweetId/likes",
  );
  expect(path.relativeTo(path.settings).security._build()).toBe("security");
  expect(path.relativeTo(path).settings.security._build()).toBe("settings/security");
  expect(path.relativeTo(path.settings)._build()).toBe("");
  expect(path.relativeTo(path[1])[2][3]._build()).toBe("2/3");
  expect(typeof path.relativeTo).toBe("function");
  expect((path.users as any).relativeTo).toBeUndefined();
});
