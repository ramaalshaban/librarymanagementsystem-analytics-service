const { ListAnalyticSnapshotsManager } = require("managers");

const AnalyticsRestController = require("../../AnalyticsServiceRestController");

class ListAnalyticSnapshotsRestController extends AnalyticsRestController {
  constructor(req, res) {
    super("listAnalyticSnapshots", "listanalyticsnapshots", req, res);
    this.dataName = "analyticSnapshots";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListAnalyticSnapshotsManager(this._req, "rest");
  }
}

const listAnalyticSnapshots = async (req, res, next) => {
  const listAnalyticSnapshotsRestController =
    new ListAnalyticSnapshotsRestController(req, res);
  try {
    await listAnalyticSnapshotsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listAnalyticSnapshots;
