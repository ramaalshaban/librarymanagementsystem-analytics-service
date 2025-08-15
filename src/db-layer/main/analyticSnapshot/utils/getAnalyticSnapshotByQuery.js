const { HttpServerError, BadRequestError } = require("common");

const { AnalyticSnapshot } = require("models");

const getAnalyticSnapshotByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const analyticSnapshot = await AnalyticSnapshot.findOne({
      ...query,
      isActive: true,
    });

    if (!analyticSnapshot) return null;

    return analyticSnapshot.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAnalyticSnapshotByQuery",
      err,
    );
  }
};

module.exports = getAnalyticSnapshotByQuery;
