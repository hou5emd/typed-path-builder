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
const typedRelativePath = typedPath.users.userId.tweets.tweetId.likes.relativeTo(
  typedPath.users.userId,
);

type RootPath = ReturnType<typeof typedPath.build>;
type UsersPath = ReturnType<typeof typedPath.users.build>;
type NestedRelativePath = ReturnType<typeof typedRelativePath.build>;

const rootPathTypecheck: Expect<Equal<RootPath, "/">> = true;
const usersPathTypecheck: Expect<Equal<UsersPath, "/users">> = true;
const nestedRelativePathTypecheck: Expect<
  Equal<NestedRelativePath, "tweets/:tweetId/likes">
> = true;

test("createPathBuilder", () => {
  const path = typedPath;

  expect(path.build()).toBe("/");
  expect(path.users.build()).toBe("/users");
  expect(path.users.userId.build()).toBe("/users/:userId");
  expect(path.users.userId.tweets.build()).toBe("/users/:userId/tweets");
  expect(path.users.userId.tweets.tweetId.build()).toBe("/users/:userId/tweets/:tweetId");
  expect(path.users.userId.tweets.tweetId.likes.build()).toBe(
    "/users/:userId/tweets/:tweetId/likes",
  );
  expect(path.users.userId.tweets.tweetId.retweets.build()).toBe(
    "/users/:userId/tweets/:tweetId/retweets",
  );
  expect(path.users.userId.likes.build()).toBe("/users/:userId/likes");
  expect(path.settings.build()).toBe("/settings");
  expect(path.settings.security.build()).toBe("/settings/security");
  expect(path.settings.privacies.build()).toBe("/settings/privacies");
  expect(path[1][2][3][4][5].build()).toBe("/1/2/3/4/5");

  expect(
    path.users.userId.tweets.tweetId.likes.relativeTo(path.users.userId).build(),
  ).toBe("tweets/:tweetId/likes");
  expect(path.settings.security.relativeTo(path.settings).build()).toBe("security");
  expect(path.settings.security.relativeTo(path).build()).toBe("settings/security");
  expect(path.settings.relativeTo(path.settings).build()).toBe("");
  expect(path[1][2][3].relativeTo(path[1]).build()).toBe("2/3");

  const invalidRelativePath = path.settings.relativeTo(path.users);

  expect(() => invalidRelativePath.build()).toThrow(
    'Cannot build relative path from "/users" to "/settings" because the base path is not an ancestor of the target path.',
  );
  expect(() => path.users.relativeTo(path.users.userId).build()).toThrow(
    'Cannot build relative path from "/users/:userId" to "/users" because the base path is not an ancestor of the target path.',
  );
});
