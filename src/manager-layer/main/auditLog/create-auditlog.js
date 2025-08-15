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
const { dbCreateAuditlog } = require("dbLayer");

class CreateAuditLogManager extends AuditLogManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createAuditLog",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "auditLog";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.actorUserId = this.actorUserId;
    jsonObj.actionType = this.actionType;
    jsonObj.targetObjectType = this.targetObjectType;
    jsonObj.targetObjectId = this.targetObjectId;
    jsonObj.context = this.context;
    jsonObj.note = this.note;
  }

  readRestParameters(request) {
    this.actorUserId = request.body?.actorUserId;
    this.actionType = request.body?.actionType;
    this.targetObjectType = request.body?.targetObjectType;
    this.targetObjectId = request.body?.targetObjectId;
    this.context = request.body?.context;
    this.note = request.body?.note;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.actorUserId = request.mcpParams.actorUserId;
    this.actionType = request.mcpParams.actionType;
    this.targetObjectType = request.mcpParams.targetObjectType;
    this.targetObjectId = request.mcpParams.targetObjectId;
    this.context = request.mcpParams.context;
    this.note = request.mcpParams.note;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.actionType == null) {
      throw new BadRequestError("errMsg_actionTypeisRequired");
    }

    if (this.targetObjectType == null) {
      throw new BadRequestError("errMsg_targetObjectTypeisRequired");
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
    // make an awaited call to the dbCreateAuditlog function to create the auditlog and return the result to the controller
    const auditlog = await dbCreateAuditlog(this);

    return auditlog;
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.auditLogId = this.id;
    if (!this.auditLogId) this.auditLogId = newObjectId();

    const dataClause = {
      _id: this.auditLogId,
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

module.exports = CreateAuditLogManager;
