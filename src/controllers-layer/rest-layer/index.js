const mainRouters = require("./main");
const sessionRouter = require("./session-router");
module.exports = {
  ...mainRouters,
  AnalyticsServiceRestController: require("./AnalyticsServiceRestController"),
  ...sessionRouter,
};
