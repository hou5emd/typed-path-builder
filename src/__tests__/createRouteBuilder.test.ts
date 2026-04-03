import { createRouteBuilder } from "../createRouteBuilder";

const routeConfig = {
  users: {
    ":userId": {
      tweets: {
        ":tweetId": {
          likes: {},
          retweets: {},
        },
      },
      likes: {
        _queries: {
          param1: {},
          param2: {},
          param3: {},
        },
      },
    },
  },
  settings: {
    security: {},
    privacies: {},
  },
  1: { 2: { 3: { 4: { 5: {} } } } },
};

test("createRouteBuilder", () => {
  const route = createRouteBuilder(routeConfig);

  expect(route.build()).toBe("/");
  expect(route.users.build()).toBe("/users");
  expect(route.users.userId("user000").build()).toBe("/users/user000");
  expect(route.users.userId("user000").tweets.build()).toBe("/users/user000/tweets");
  expect(route.users.userId("user000").tweets.tweetId("tweet111").build()).toBe(
    "/users/user000/tweets/tweet111",
  );
  expect(route.users.userId("user000").tweets.tweetId("tweet111").likes.build()).toBe(
    "/users/user000/tweets/tweet111/likes",
  );
  expect(route.users.userId("user000").tweets.tweetId("tweet111").retweets.build()).toBe(
    "/users/user000/tweets/tweet111/retweets",
  );
  expect(route.users.userId("user000").likes.build()).toBe("/users/user000/likes");
  expect(
    route.users
      .userId("user000")
      .likes._queries({ param1: "parameter1", param3: "parameter3" })
      .build(),
  ).toBe("/users/user000/likes?param1=parameter1&param3=parameter3");
  expect(route.users.userId("user000").likes._queries({}).build()).toBe(
    "/users/user000/likes",
  );
  expect(route.settings.build()).toBe("/settings");
  expect(route.settings.security.build()).toBe("/settings/security");
  expect(route.settings.privacies.build()).toBe("/settings/privacies");
  expect(route[1][2][3][4][5].build()).toBe("/1/2/3/4/5");
});
