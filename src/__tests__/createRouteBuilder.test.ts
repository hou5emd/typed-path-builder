import { createRouteBuilder } from "../createRouteBuilder";

const routeConfig = {
  abv: {
    dss: {
      ":optionalParam?": {
        dsa: {},
      },
      staticChild: {},
    },
  },
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

const typedRoute = createRouteBuilder(routeConfig);

test("createRouteBuilder", () => {
  const route = typedRoute;

  expect(route._build()).toBe("/");
  expect(route.abv.dss._build()).toBe("/abv/dss");
  expect(route.abv.dss.optionalParam()._build()).toBe("/abv/dss");
  expect(route.abv.dss.optionalParam().dsa._build()).toBe("/abv/dss/dsa");
  expect(route.abv.dss.optionalParam("value")._build()).toBe("/abv/dss/value");
  expect(route.abv.dss.optionalParam("value").dsa._build()).toBe("/abv/dss/value/dsa");
  expect(route.abv.dss.staticChild._build()).toBe("/abv/dss/staticChild");
  expect(route.users._build()).toBe("/users");
  expect(route.users.userId("user000")._build()).toBe("/users/user000");
  expect(route.users.userId("user000").tweets._build()).toBe("/users/user000/tweets");
  expect(route.users.userId("user000").tweets.tweetId("tweet111")._build()).toBe(
    "/users/user000/tweets/tweet111",
  );
  expect(route.users.userId("user000").tweets.tweetId("tweet111").likes._build()).toBe(
    "/users/user000/tweets/tweet111/likes",
  );
  expect(route.users.userId("user000").tweets.tweetId("tweet111").retweets._build()).toBe(
    "/users/user000/tweets/tweet111/retweets",
  );
  expect(route.users.userId("user000").likes._build()).toBe("/users/user000/likes");
  expect(
    route.users
      .userId("user000")
      .likes._queries({ param1: "parameter1", param3: "parameter3" })
      ._build(),
  ).toBe("/users/user000/likes?param1=parameter1&param3=parameter3");
  expect(
    route.users.userId("user000").likes._queries({ param1: "414214" })._build(),
  ).toBe("/users/user000/likes?param1=414214");
  expect(route.settings._build()).toBe("/settings");
  expect(route.settings.security._build()).toBe("/settings/security");
  expect(route.settings.privacies._build()).toBe("/settings/privacies");
  expect(route[1][2][3][4][5]._build()).toBe("/1/2/3/4/5");
});
