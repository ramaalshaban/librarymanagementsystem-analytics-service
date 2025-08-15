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
const { dbDeleteChangestreamevent } = require("dbLayer");

class DeleteChangeStreamEventManager extends ChangeStreamEventManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteChangeStreamEvent",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "changeStreamEvent";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.changeStreamEventId = this.changeStreamEventId;
  }

  readRestParameters(request) {
    this.changeStreamEventId = request.params?.changeStreamEventId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.changeStreamEventId = request.mcpParams.changeStreamEventId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getChangeStreamEventById } = require("dbLayer");
    this.changeStreamEvent = await getChangeStreamEventById(
      this.changeStreamEventId,
    );
    if (!this.changeStreamEvent) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.changeStreamEventId == null) {
      throw new BadRequestError("errMsg_changeStreamEventIdisRequired");
    }

    // ID
    if (
      this.changeStreamEventId &&
      !isValidObjectId(this.changeStreamEventId) &&
      !isValidUUID(this.changeStreamEventId)
    ) {
      throw new BadRequestError("errMsg_changeStreamEventIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.changeStreamEvent?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbDeleteChangestreamevent function to delete the changestreamevent and return the result to the controller
    const changestreamevent = await dbDeleteChangestreamevent(this);

    return changestreamevent;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.changeStreamEventId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToMongoDbQuery } = require("common");

    const routeQuery = await this.getRouteQuery();
    return convertUserQueryToMongoDbQuery(routeQuery);
  }
}

module.exports = DeleteChangeStreamEventManager;
