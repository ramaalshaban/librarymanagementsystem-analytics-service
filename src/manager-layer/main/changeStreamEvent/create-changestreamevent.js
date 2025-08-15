const ChangeStreamEventManager = require("./ChangeStreamEventManager");
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
const { dbCreateChangestreamevent } = require("dbLayer");

class CreateChangeStreamEventManager extends ChangeStreamEventManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createChangeStreamEvent",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "changeStreamEvent";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.streamName = this.streamName;
    jsonObj.payload = this.payload;
    jsonObj.sourceObject = this.sourceObject;
  }

  readRestParameters(request) {
    this.streamName = request.body?.streamName;
    this.payload = request.body?.payload;
    this.sourceObject = request.body?.sourceObject;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.streamName = request.mcpParams.streamName;
    this.payload = request.mcpParams.payload;
    this.sourceObject = request.mcpParams.sourceObject;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.streamName == null) {
      throw new BadRequestError("errMsg_streamNameisRequired");
    }

    if (this.payload == null) {
      throw new BadRequestError("errMsg_payloadisRequired");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.changeStreamEvent?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateChangestreamevent function to create the changestreamevent and return the result to the controller
    const changestreamevent = await dbCreateChangestreamevent(this);

    return changestreamevent;
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.changeStreamEventId = this.id;
    if (!this.changeStreamEventId) this.changeStreamEventId = newObjectId();

    const dataClause = {
      _id: this.changeStreamEventId,
      streamName: this.streamName,
      payload: this.payload
        ? typeof this.payload == "string"
          ? JSON.parse(this.payload)
          : this.payload
        : null,
      sourceObject: this.sourceObject,
    };

    return dataClause;
  }
}

module.exports = CreateChangeStreamEventManager;
