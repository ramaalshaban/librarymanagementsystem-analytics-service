const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
// do i need to add the referring part or does the mongodb use the things differently
// is there specific approch to handle the referential integrity or it done interrenly
const { AnalyticSnapshot } = require("models");
const { ObjectId } = require("mongoose").Types;

const {
  AnalyticSnapshotQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteMongooseCommand } = require("dbCommand");

class DbDeleteAnalyticsnapshotCommand extends DBSoftDeleteMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, AnalyticSnapshot, instanceMode);
    this.commandName = "dbDeleteAnalyticsnapshot";
    this.nullResult = false;
    this.objectName = "analyticSnapshot";
    this.serviceLabel = "librarymanagementsystem-analytics-service";
    this.dbEvent =
      "librarymanagementsystem-analytics-service" +
      "-dbevent-" +
      "analyticsnapshot-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new AnalyticSnapshotQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "analyticSnapshot",
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

const dbDeleteAnalyticsnapshot = async (input) => {
  input.id = input.analyticSnapshotId;
  const dbDeleteCommand = new DbDeleteAnalyticsnapshotCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteAnalyticsnapshot;
