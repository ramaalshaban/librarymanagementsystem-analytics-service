const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { AuditLog } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetAuditlogCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, AuditLog);
    this.commandName = "dbGetAuditlog";
    this.nullResult = false;
    this.objectName = "auditLog";
    this.serviceLabel = "librarymanagementsystem-analytics-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (AuditLog.getCqrsJoins) {
      await AuditLog.getCqrsJoins(data);
    }
  }

  // populateQuery(query) {
  //  if (!this.input.getJoins) return query;
  //
  //  return query;
  //}

  initOwnership(input) {
    super.initOwnership(input);
  }

  async checkEntityOwnership(entity) {
    return true;
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbGetAuditlog = (input) => {
  input.id = input.auditLogId;
  const dbGetCommand = new DbGetAuditlogCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetAuditlog;
