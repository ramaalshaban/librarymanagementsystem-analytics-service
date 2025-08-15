const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { AnalyticSnapshot } = require("models");

const getAnalyticSnapshotListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const analyticSnapshot = await AnalyticSnapshot.find(query);

    if (!analyticSnapshot || analyticSnapshot.length === 0) return [];

    //should i add not found error or only return empty array?
    //      if (!analyticSnapshot || analyticSnapshot.length === 0) {
    //      throw new NotFoundError(
    //      `AnalyticSnapshot with the specified criteria not found`
    //  );
    //}

    return analyticSnapshot.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAnalyticSnapshotListByQuery",
      err,
    );
  }
};

module.exports = getAnalyticSnapshotListByQuery;
