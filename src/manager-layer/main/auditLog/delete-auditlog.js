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
const { dbDeleteAuditlog } = require("dbLayer");

class DeleteAuditLogManager extends AuditLogManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteAuditLog",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "auditLog";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.auditLogId = this.auditLogId;
  }

  readRestParameters(request) {
    this.auditLogId = request.params?.auditLogId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.auditLogId = request.mcpParams.auditLogId;
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
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.auditLog?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbDeleteAuditlog function to delete the auditlog and return the result to the controller
    const auditlog = await dbDeleteAuditlog(this);

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
}

module.exports = DeleteAuditLogManager;
