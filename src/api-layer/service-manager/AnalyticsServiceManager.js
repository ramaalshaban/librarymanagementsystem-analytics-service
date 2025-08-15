const ApiManager = require("./ApiManager");

class AnalyticsServiceManager extends ApiManager {
  constructor(request, options) {
    super(request, options);
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
  }
}

module.exports = AnalyticsServiceManager;
