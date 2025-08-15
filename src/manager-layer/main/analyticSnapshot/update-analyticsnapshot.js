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
const { dbUpdateAnalyticsnapshot } = require("dbLayer");

class UpdateAnalyticSnapshotManager extends AnalyticSnapshotManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateAnalyticSnapshot",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "analyticSnapshot";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.analyticSnapshotId = this.analyticSnapshotId;
    jsonObj.snapshotType = this.snapshotType;
    jsonObj.scopeType = this.scopeType;
    jsonObj.scopeId = this.scopeId;
    jsonObj.timeRange = this.timeRange;
    jsonObj.data = this.data;
    jsonObj.generatedBy = this.generatedBy;
    jsonObj.note = this.note;
  }

  readRestParameters(request) {
    this.analyticSnapshotId = request.params?.analyticSnapshotId;
    this.snapshotType = request.body?.snapshotType;
    this.scopeType = request.body?.scopeType;
    this.scopeId = request.body?.scopeId;
    this.timeRange = request.body?.timeRange;
    this.data = request.body?.data;
    this.generatedBy = request.body?.generatedBy;
    this.note = request.body?.note;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.analyticSnapshotId = request.mcpParams.analyticSnapshotId;
    this.snapshotType = request.mcpParams.snapshotType;
    this.scopeType = request.mcpParams.scopeType;
    this.scopeId = request.mcpParams.scopeId;
    this.timeRange = request.mcpParams.timeRange;
    this.data = request.mcpParams.data;
    this.generatedBy = request.mcpParams.generatedBy;
    this.note = request.mcpParams.note;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getAnalyticSnapshotById } = require("dbLayer");
    this.analyticSnapshot = await getAnalyticSnapshotById(
      this.analyticSnapshotId,
    );
    if (!this.analyticSnapshot) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.analyticSnapshotId == null) {
      throw new BadRequestError("errMsg_analyticSnapshotIdisRequired");
    }

    // ID
    if (
      this.analyticSnapshotId &&
      !isValidObjectId(this.analyticSnapshotId) &&
      !isValidUUID(this.analyticSnapshotId)
    ) {
      throw new BadRequestError("errMsg_analyticSnapshotIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.analyticSnapshot?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateAnalyticsnapshot function to update the analyticsnapshot and return the result to the controller
    const analyticsnapshot = await dbUpdateAnalyticsnapshot(this);

    return analyticsnapshot;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.analyticSnapshotId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToMongoDbQuery } = require("common");

    const routeQuery = await this.getRouteQuery();
    return convertUserQueryToMongoDbQuery(routeQuery);
  }

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
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

module.exports = UpdateAnalyticSnapshotManager;
