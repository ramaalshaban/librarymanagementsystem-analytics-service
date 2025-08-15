const { HttpServerError } = require("common");

const { ChangeStreamEvent } = require("models");

const getChangeStreamEventById = async (changeStreamEventId) => {
  try {
    let changeStreamEvent;

    if (Array.isArray(changeStreamEventId)) {
      changeStreamEvent = await ChangeStreamEvent.find({
        _id: { $in: changeStreamEventId },
        isActive: true,
      });
    } else {
      changeStreamEvent = await ChangeStreamEvent.findOne({
        _id: changeStreamEventId,
        isActive: true,
      });
    }

    if (!changeStreamEvent) {
      return null;
    }

    return Array.isArray(changeStreamEventId)
      ? changeStreamEvent.map((item) => item.getData())
      : changeStreamEvent.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingChangeStreamEventById",
      err,
    );
  }
};

module.exports = getChangeStreamEventById;
