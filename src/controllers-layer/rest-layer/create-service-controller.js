const AnalyticsServiceRestController = require("./AnalyticsServiceRestController");

module.exports = (name, routeName, req, res) => {
  const restController = new AnalyticsServiceRestController(
    name,
    routeName,
    req,
    res,
  );
  return restController;
};
