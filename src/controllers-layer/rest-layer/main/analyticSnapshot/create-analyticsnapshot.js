const { CreateAnalyticSnapshotManager } = require("managers");

const AnalyticsRestController = require("../../AnalyticsServiceRestController");

class CreateAnalyticSnapshotRestController extends AnalyticsRestController {
  constructor(req, res) {
    super("createAnalyticSnapshot", "createanalyticsnapshot", req, res);
    this.dataName = "analyticSnapshot";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateAnalyticSnapshotManager(this._req, "rest");
  }
}

const createAnalyticSnapshot = async (req, res, next) => {
  const createAnalyticSnapshotRestController =
    new CreateAnalyticSnapshotRestController(req, res);
  try {
    await createAnalyticSnapshotRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createAnalyticSnapshot;
