const { DeleteAnalyticSnapshotManager } = require("managers");

const AnalyticsRestController = require("../../AnalyticsServiceRestController");

class DeleteAnalyticSnapshotRestController extends AnalyticsRestController {
  constructor(req, res) {
    super("deleteAnalyticSnapshot", "deleteanalyticsnapshot", req, res);
    this.dataName = "analyticSnapshot";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteAnalyticSnapshotManager(this._req, "rest");
  }
}

const deleteAnalyticSnapshot = async (req, res, next) => {
  const deleteAnalyticSnapshotRestController =
    new DeleteAnalyticSnapshotRestController(req, res);
  try {
    await deleteAnalyticSnapshotRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteAnalyticSnapshot;
