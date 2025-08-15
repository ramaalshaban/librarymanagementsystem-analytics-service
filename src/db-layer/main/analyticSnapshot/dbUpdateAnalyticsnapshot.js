const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { AnalyticSnapshot } = require("models");

const { DBUpdateMongooseCommand } = require("dbCommand");

const {
  AnalyticSnapshotQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAnalyticSnapshotById = require("./utils/getAnalyticSnapshotById");

class DbUpdateAnalyticsnapshotCommand extends DBUpdateMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, AnalyticSnapshot, instanceMode);
    this.commandName = "dbUpdateAnalyticsnapshot";
    this.nullResult = false;
    this.objectName = "analyticSnapshot";
    this.serviceLabel = "librarymanagementsystem-analytics-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "librarymanagementsystem-analytics-service-dbevent-analyticsnapshot-updated";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async transposeResult() {
    // transpose dbData
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
    const dbData = await getAnalyticSnapshotById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }
}

const dbUpdateAnalyticsnapshot = async (input) => {
  input.id = input.analyticSnapshotId;
  const dbUpdateCommand = new DbUpdateAnalyticsnapshotCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateAnalyticsnapshot;
