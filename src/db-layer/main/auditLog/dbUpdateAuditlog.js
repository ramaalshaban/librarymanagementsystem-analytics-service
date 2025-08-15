const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { AuditLog } = require("models");

const { DBUpdateMongooseCommand } = require("dbCommand");

const { AuditLogQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAuditLogById = require("./utils/getAuditLogById");

class DbUpdateAuditlogCommand extends DBUpdateMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, AuditLog, instanceMode);
    this.commandName = "dbUpdateAuditlog";
    this.nullResult = false;
    this.objectName = "auditLog";
    this.serviceLabel = "librarymanagementsystem-analytics-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "librarymanagementsystem-analytics-service-dbevent-auditlog-updated";
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
    this.queryCacheInvalidator = new AuditLogQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "auditLog",
      this.session,
      this.requestId,
    );
    const dbData = await getAuditLogById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }
}

const dbUpdateAuditlog = async (input) => {
  input.id = input.auditLogId;
  const dbUpdateCommand = new DbUpdateAuditlogCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateAuditlog;
