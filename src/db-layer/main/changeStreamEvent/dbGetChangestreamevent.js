const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { ChangeStreamEvent } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetChangestreameventCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, ChangeStreamEvent);
    this.commandName = "dbGetChangestreamevent";
    this.nullResult = false;
    this.objectName = "changeStreamEvent";
    this.serviceLabel = "librarymanagementsystem-analytics-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (ChangeStreamEvent.getCqrsJoins) {
      await ChangeStreamEvent.getCqrsJoins(data);
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

const dbGetChangestreamevent = (input) => {
  input.id = input.changeStreamEventId;
  const dbGetCommand = new DbGetChangestreameventCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetChangestreamevent;
