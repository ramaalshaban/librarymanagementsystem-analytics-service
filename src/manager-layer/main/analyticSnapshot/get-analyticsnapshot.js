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
const { dbGetAnalyticsnapshot } = require("dbLayer");

class GetAnalyticSnapshotManager extends AnalyticSnapshotManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getAnalyticSnapshot",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "analyticSnapshot";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.analyticSnapshotId = this.analyticSnapshotId;
  }

  readRestParameters(request) {
    this.analyticSnapshotId = request.params?.analyticSnapshotId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.analyticSnapshotId = request.mcpParams.analyticSnapshotId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

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
    // make an awaited call to the dbGetAnalyticsnapshot function to get the analyticsnapshot and return the result to the controller
    const analyticsnapshot = await dbGetAnalyticsnapshot(this);

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
}

module.exports = GetAnalyticSnapshotManager;
