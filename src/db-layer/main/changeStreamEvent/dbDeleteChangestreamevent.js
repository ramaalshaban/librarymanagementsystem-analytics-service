const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
// do i need to add the referring part or does the mongodb use the things differently
// is there specific approch to handle the referential integrity or it done interrenly
const { ChangeStreamEvent } = require("models");
const { ObjectId } = require("mongoose").Types;

const {
  ChangeStreamEventQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteMongooseCommand } = require("dbCommand");

class DbDeleteChangestreameventCommand extends DBSoftDeleteMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, ChangeStreamEvent, instanceMode);
    this.commandName = "dbDeleteChangestreamevent";
    this.nullResult = false;
    this.objectName = "changeStreamEvent";
    this.serviceLabel = "librarymanagementsystem-analytics-service";
    this.dbEvent =
      "librarymanagementsystem-analytics-service" +
      "-dbevent-" +
      "changestreamevent-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
    await elasticIndexer.deleteData(this.dbData.id);
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbDeleteChangestreamevent = async (input) => {
  input.id = input.changeStreamEventId;
  const dbDeleteCommand = new DbDeleteChangestreameventCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteChangestreamevent;
