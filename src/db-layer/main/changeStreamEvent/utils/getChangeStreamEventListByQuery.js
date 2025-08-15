const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { ChangeStreamEvent } = require("models");

const getChangeStreamEventListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const changeStreamEvent = await ChangeStreamEvent.find(query);

    if (!changeStreamEvent || changeStreamEvent.length === 0) return [];

    //should i add not found error or only return empty array?
    //      if (!changeStreamEvent || changeStreamEvent.length === 0) {
    //      throw new NotFoundError(
    //      `ChangeStreamEvent with the specified criteria not found`
    //  );
    //}

    return changeStreamEvent.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingChangeStreamEventListByQuery",
      err,
    );
  }
};

module.exports = getChangeStreamEventListByQuery;
