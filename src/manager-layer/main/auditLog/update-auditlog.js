const AuditLogManager = require("./AuditLogManager");
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
const { dbUpdateAuditlog } = require("dbLayer");

class UpdateAuditLogManager extends AuditLogManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateAuditLog",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "auditLog";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.auditLogId = this.auditLogId;
    jsonObj.actorUserId = this.actorUserId;
    jsonObj.actionType = this.actionType;
    jsonObj.targetObjectType = this.targetObjectType;
    jsonObj.targetObjectId = this.targetObjectId;
    jsonObj.context = this.context;
    jsonObj.note = this.note;
  }

  readRestParameters(request) {
    this.auditLogId = request.params?.auditLogId;
    this.actorUserId = request.body?.actorUserId;
    this.actionType = request.body?.actionType;
    this.targetObjectType = request.body?.targetObjectType;
    this.targetObjectId = request.body?.targetObjectId;
    this.context = request.body?.context;
    this.note = request.body?.note;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.auditLogId = request.mcpParams.auditLogId;
    this.actorUserId = request.mcpParams.actorUserId;
    this.actionType = request.mcpParams.actionType;
    this.targetObjectType = request.mcpParams.targetObjectType;
    this.targetObjectId = request.mcpParams.targetObjectId;
    this.context = request.mcpParams.context;
    this.note = request.mcpParams.note;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getAuditLogById } = require("dbLayer");
    this.auditLog = await getAuditLogById(this.auditLogId);
    if (!this.auditLog) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.auditLogId == null) {
      throw new BadRequestError("errMsg_auditLogIdisRequired");
    }

    // ID
    if (
      this.auditLogId &&
      !isValidObjectId(this.auditLogId) &&
      !isValidUUID(this.auditLogId)
    ) {
      throw new BadRequestError("errMsg_auditLogIdisNotAValidID");
    }

    // ID
    if (
      this.actorUserId &&
      !isValidObjectId(this.actorUserId) &&
      !isValidUUID(this.actorUserId)
    ) {
      throw new BadRequestError("errMsg_actorUserIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.auditLog?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateAuditlog function to update the auditlog and return the result to the controller
    const auditlog = await dbUpdateAuditlog(this);

    return auditlog;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.auditLogId }, { isActive: true }] };

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
      actorUserId: this.actorUserId,
      actionType: this.actionType,
      targetObjectType: this.targetObjectType,
      targetObjectId: this.targetObjectId,
      context: this.context
        ? typeof this.context == "string"
          ? JSON.parse(this.context)
          : this.context
        : null,
      note: this.note,
    };

    return dataClause;
  }
}

module.exports = UpdateAuditLogManager;
