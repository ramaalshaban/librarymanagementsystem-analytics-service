const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const AnalyticsServiceManager = require("../../service-manager/AnalyticsServiceManager");

/* Base Class For the Crud Routes Of DbObject AnalyticSnapshot */
class AnalyticSnapshotManager extends AnalyticsServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "analyticSnapshot";
    this.modelName = "AnalyticSnapshot";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = AnalyticSnapshotManager;
