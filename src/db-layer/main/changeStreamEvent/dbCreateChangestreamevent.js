// exsik olan :
//if exits update and if not exits create
//if index.onDuplicate == "throwError" throw error
//

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { ChangeStreamEvent } = require("models");

const { DBCreateMongooseCommand } = require("dbCommand");

const {
  ChangeStreamEventQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getChangeStreamEventById = require("./utils/getChangeStreamEventById");

class DbCreateChangestreameventCommand extends DBCreateMongooseCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateChangestreamevent";
    this.objectName = "changeStreamEvent";
    this.serviceLabel = "librarymanagementsystem-analytics-service";
    this.dbEvent =
      "librarymanagementsystem-analytics-service-dbevent-changestreamevent-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new ChangeStreamEventQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "changeStreamEvent",
      this.session,
      this.requestId,
    );
    const dbData = await getChangeStreamEventById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let changeStreamEvent = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      if (!updated && this.dataClause.id && !exists) {
        changeStreamEvent =
          changeStreamEvent ||
          (await ChangeStreamEvent.findById(this.dataClause.id));
        if (changeStreamEvent) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await changeStreamEvent.update(this.dataClause);
          updated = true;
        }
      }
    } catch (error) {
      const eDetail = {
        dataClause: this.dataClause,
        errorStack: error.stack,
        checkoutResult: this.input.checkoutResult,
      };
      throw new HttpServerError(
        "Error in checking unique index when creating ChangeStreamEvent",
        eDetail,
      );
    }

    if (!updated && !exists) {
      changeStreamEvent = await ChangeStreamEvent.create(this.dataClause);
    }

    this.dbData = changeStreamEvent.getData();
    this.input.changeStreamEvent = this.dbData;
    await this.create_childs();
  }
}

const dbCreateChangestreamevent = async (input) => {
  const dbCreateCommand = new DbCreateChangestreameventCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateChangestreamevent;
