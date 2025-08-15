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

const { AuditLog } = require("models");

const { DBCreateMongooseCommand } = require("dbCommand");

const { AuditLogQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getAuditLogById = require("./utils/getAuditLogById");

class DbCreateAuditlogCommand extends DBCreateMongooseCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateAuditlog";
    this.objectName = "auditLog";
    this.serviceLabel = "librarymanagementsystem-analytics-service";
    this.dbEvent =
      "librarymanagementsystem-analytics-service-dbevent-auditlog-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let auditLog = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        actorUserId: this.dataClause.actorUserId,
        actionType: this.dataClause.actionType,
      };

      auditLog = auditLog || (await AuditLog.findOne(whereClause));

      if (auditLog) {
        delete this.dataClause.id;
        this.dataClause.isActive = true;
        if (!updated) await auditLog.update(this.dataClause);
        updated = true;
      }

      if (!updated && this.dataClause.id && !exists) {
        auditLog = auditLog || (await AuditLog.findById(this.dataClause.id));
        if (auditLog) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await auditLog.update(this.dataClause);
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
        "Error in checking unique index when creating AuditLog",
        eDetail,
      );
    }

    if (!updated && !exists) {
      auditLog = await AuditLog.create(this.dataClause);
    }

    this.dbData = auditLog.getData();
    this.input.auditLog = this.dbData;
    await this.create_childs();
  }
}

const dbCreateAuditlog = async (input) => {
  const dbCreateCommand = new DbCreateAuditlogCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateAuditlog;
