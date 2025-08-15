const { HttpServerError, BadRequestError } = require("common");

const { ChangeStreamEvent } = require("models");

const getChangeStreamEventByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const changeStreamEvent = await ChangeStreamEvent.findOne({
      ...query,
      isActive: true,
    });

    if (!changeStreamEvent) return null;

    return changeStreamEvent.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingChangeStreamEventByQuery",
      err,
    );
  }
};

module.exports = getChangeStreamEventByQuery;
