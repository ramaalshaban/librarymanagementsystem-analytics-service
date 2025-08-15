const { GetAnalyticSnapshotManager } = require("managers");

const AnalyticsRestController = require("../../AnalyticsServiceRestController");

class GetAnalyticSnapshotRestController extends AnalyticsRestController {
  constructor(req, res) {
    super("getAnalyticSnapshot", "getanalyticsnapshot", req, res);
    this.dataName = "analyticSnapshot";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetAnalyticSnapshotManager(this._req, "rest");
  }
}

const getAnalyticSnapshot = async (req, res, next) => {
  const getAnalyticSnapshotRestController =
    new GetAnalyticSnapshotRestController(req, res);
  try {
    await getAnalyticSnapshotRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getAnalyticSnapshot;
