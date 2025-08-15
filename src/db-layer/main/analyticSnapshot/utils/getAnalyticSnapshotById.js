const { HttpServerError } = require("common");

const { AnalyticSnapshot } = require("models");

const getAnalyticSnapshotById = async (analyticSnapshotId) => {
  try {
    let analyticSnapshot;

    if (Array.isArray(analyticSnapshotId)) {
      analyticSnapshot = await AnalyticSnapshot.find({
        _id: { $in: analyticSnapshotId },
        isActive: true,
      });
    } else {
      analyticSnapshot = await AnalyticSnapshot.findOne({
        _id: analyticSnapshotId,
        isActive: true,
      });
    }

    if (!analyticSnapshot) {
      return null;
    }

    return Array.isArray(analyticSnapshotId)
      ? analyticSnapshot.map((item) => item.getData())
      : analyticSnapshot.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAnalyticSnapshotById",
      err,
    );
  }
};

module.exports = getAnalyticSnapshotById;
