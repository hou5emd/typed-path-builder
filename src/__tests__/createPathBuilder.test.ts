import { createPathBuilder } from "../createPathBuilder";

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

test("createPathBuilder", () => {
  const path = createPathBuilder(routeConfig);

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
});
