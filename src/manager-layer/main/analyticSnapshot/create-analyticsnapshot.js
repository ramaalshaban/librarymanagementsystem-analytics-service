const AnalyticSnapshotManager = require("./AnalyticSnapshotManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateAnalyticsnapshot } = require("dbLayer");

class CreateAnalyticSnapshotManager extends AnalyticSnapshotManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createAnalyticSnapshot",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "analyticSnapshot";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.snapshotType = this.snapshotType;
    jsonObj.scopeType = this.scopeType;
    jsonObj.scopeId = this.scopeId;
    jsonObj.timeRange = this.timeRange;
    jsonObj.data = this.data;
    jsonObj.generatedBy = this.generatedBy;
    jsonObj.note = this.note;
  }

  readRestParameters(request) {
    this.snapshotType = request.body?.snapshotType;
    this.scopeType = request.body?.scopeType;
    this.scopeId = request.body?.scopeId;
    this.timeRange = request.body?.timeRange;
    this.data = request.body?.data;
    this.generatedBy = request.body?.generatedBy;
    this.note = request.body?.note;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.snapshotType = request.mcpParams.snapshotType;
    this.scopeType = request.mcpParams.scopeType;
    this.scopeId = request.mcpParams.scopeId;
    this.timeRange = request.mcpParams.timeRange;
    this.data = request.mcpParams.data;
    this.generatedBy = request.mcpParams.generatedBy;
    this.note = request.mcpParams.note;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.snapshotType == null) {
      throw new BadRequestError("errMsg_snapshotTypeisRequired");
    }

    if (this.scopeType == null) {
      throw new BadRequestError("errMsg_scopeTypeisRequired");
    }

    if (this.timeRange == null) {
      throw new BadRequestError("errMsg_timeRangeisRequired");
    }

    if (this.data == null) {
      throw new BadRequestError("errMsg_dataisRequired");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.analyticSnapshot?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateAnalyticsnapshot function to create the analyticsnapshot and return the result to the controller
    const analyticsnapshot = await dbCreateAnalyticsnapshot(this);

    return analyticsnapshot;
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.analyticSnapshotId = this.id;
    if (!this.analyticSnapshotId) this.analyticSnapshotId = newObjectId();

    const dataClause = {
      _id: this.analyticSnapshotId,
      snapshotType: this.snapshotType,
      scopeType: this.scopeType,
      scopeId: this.scopeId,
      timeRange: this.timeRange
        ? typeof this.timeRange == "string"
          ? JSON.parse(this.timeRange)
          : this.timeRange
        : null,
      data: this.data
        ? typeof this.data == "string"
          ? JSON.parse(this.data)
          : this.data
        : null,
      generatedBy: this.generatedBy,
      note: this.note,
    };

    return dataClause;
  }
}

module.exports = CreateAnalyticSnapshotManager;
