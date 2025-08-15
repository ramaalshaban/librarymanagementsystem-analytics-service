const { HttpServerError } = require("common");

const { AnalyticSnapshot } = require("models");

const updateAnalyticSnapshotByIdList = async (idList, dataClause) => {
  try {
    await AnalyticSnapshot.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await AnalyticSnapshot.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const analyticSnapshotIdList = updatedDocs.map((doc) => doc._id);

    return analyticSnapshotIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingAnalyticSnapshotByIdList",
      err,
    );
  }
};

module.exports = updateAnalyticSnapshotByIdList;
