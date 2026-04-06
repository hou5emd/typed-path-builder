import { createPathBuilder } from "../createPathBuilder";

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

test("createPathBuilder", () => {
  const path = typedPath;

  expect(path._build()).toBe("/");
  expect(path.abv.dss._build()).toBe("/abv/dss");
  expect(path.abv.dss.optionalParam._build()).toBe("/abv/dss/:optionalParam?");
  expect(path.abv.dss.optionalParam.dsa._build()).toBe("/abv/dss/:optionalParam?/dsa");
  expect(path.abv.dss.optionalParam.dsa._build()).toBe("/abv/dss/:optionalParam?/dsa");
  expect(path.abv.dss.staticChild._build()).toBe("/abv/dss/staticChild");
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
  expect(path.relativeTo(path.abv.dss).optionalParam._build()).toBe(":optionalParam?");
  expect(path.relativeTo(path.abv.dss).optionalParam.dsa._build()).toBe(
    ":optionalParam?/dsa",
  );
  expect(path.relativeTo(path.settings).security._build()).toBe("security");
  expect(path.relativeTo(path).settings.security._build()).toBe("settings/security");
  expect(path.relativeTo(path.settings)._build()).toBe("");
  expect(path.relativeTo(path[1])[2][3]._build()).toBe("2/3");
  expect(typeof path.relativeTo).toBe("function");
  expect(
    (path.users as unknown as { relativeTo: undefined })?.relativeTo,
  ).toBeUndefined();
});
