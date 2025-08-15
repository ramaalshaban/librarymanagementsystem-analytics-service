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

const { AnalyticSnapshot } = require("models");

const { DBCreateMongooseCommand } = require("dbCommand");

const {
  AnalyticSnapshotQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAnalyticSnapshotById = require("./utils/getAnalyticSnapshotById");

class DbCreateAnalyticsnapshotCommand extends DBCreateMongooseCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateAnalyticsnapshot";
    this.objectName = "analyticSnapshot";
    this.serviceLabel = "librarymanagementsystem-analytics-service";
    this.dbEvent =
      "librarymanagementsystem-analytics-service-dbevent-analyticsnapshot-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let analyticSnapshot = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        snapshotType: this.dataClause.snapshotType,
        scopeType: this.dataClause.scopeType,
        scopeId: this.dataClause.scopeId,
      };

      analyticSnapshot =
        analyticSnapshot || (await AnalyticSnapshot.findOne(whereClause));

      if (analyticSnapshot) {
        delete this.dataClause.id;
        this.dataClause.isActive = true;
        if (!updated) await analyticSnapshot.update(this.dataClause);
        updated = true;
      }

      if (!updated && this.dataClause.id && !exists) {
        analyticSnapshot =
          analyticSnapshot ||
          (await AnalyticSnapshot.findById(this.dataClause.id));
        if (analyticSnapshot) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await analyticSnapshot.update(this.dataClause);
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
        "Error in checking unique index when creating AnalyticSnapshot",
        eDetail,
      );
    }

    if (!updated && !exists) {
      analyticSnapshot = await AnalyticSnapshot.create(this.dataClause);
    }

    this.dbData = analyticSnapshot.getData();
    this.input.analyticSnapshot = this.dbData;
    await this.create_childs();
  }
}

const dbCreateAnalyticsnapshot = async (input) => {
  const dbCreateCommand = new DbCreateAnalyticsnapshotCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateAnalyticsnapshot;
