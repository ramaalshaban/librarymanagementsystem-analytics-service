const { UpdateAnalyticSnapshotManager } = require("managers");

const AnalyticsRestController = require("../../AnalyticsServiceRestController");

class UpdateAnalyticSnapshotRestController extends AnalyticsRestController {
  constructor(req, res) {
    super("updateAnalyticSnapshot", "updateanalyticsnapshot", req, res);
    this.dataName = "analyticSnapshot";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateAnalyticSnapshotManager(this._req, "rest");
  }
}

const updateAnalyticSnapshot = async (req, res, next) => {
  const updateAnalyticSnapshotRestController =
    new UpdateAnalyticSnapshotRestController(req, res);
  try {
    await updateAnalyticSnapshotRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateAnalyticSnapshot;
