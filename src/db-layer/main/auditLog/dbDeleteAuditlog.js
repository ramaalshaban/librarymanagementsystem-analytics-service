const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
// do i need to add the referring part or does the mongodb use the things differently
// is there specific approch to handle the referential integrity or it done interrenly
const { AuditLog } = require("models");
const { ObjectId } = require("mongoose").Types;

const { AuditLogQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteMongooseCommand } = require("dbCommand");

class DbDeleteAuditlogCommand extends DBSoftDeleteMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, AuditLog, instanceMode);
    this.commandName = "dbDeleteAuditlog";
    this.nullResult = false;
    this.objectName = "auditLog";
    this.serviceLabel = "librarymanagementsystem-analytics-service";
    this.dbEvent =
      "librarymanagementsystem-analytics-service" +
      "-dbevent-" +
      "auditlog-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
    await elasticIndexer.deleteData(this.dbData.id);
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbDeleteAuditlog = async (input) => {
  input.id = input.auditLogId;
  const dbDeleteCommand = new DbDeleteAuditlogCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteAuditlog;
