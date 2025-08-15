const { HttpServerError } = require("common");

const { ChangeStreamEvent } = require("models");

const updateChangeStreamEventByIdList = async (idList, dataClause) => {
  try {
    await ChangeStreamEvent.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await ChangeStreamEvent.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const changeStreamEventIdList = updatedDocs.map((doc) => doc._id);

    return changeStreamEventIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingChangeStreamEventByIdList",
      err,
    );
  }
};

module.exports = updateChangeStreamEventByIdList;
