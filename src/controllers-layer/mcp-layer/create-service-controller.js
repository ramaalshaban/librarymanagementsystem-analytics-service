const AnalyticsServiceMcpController = require("./AnalyticsServiceMcpController");

module.exports = (name, routeName, params) => {
  const mcpController = new AnalyticsServiceMcpController(
    name,
    routeName,
    params,
  );
  return mcpController;
};
