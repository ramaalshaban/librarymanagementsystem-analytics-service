const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbGetAnalyticsnapshot: require("./dbGetAnalyticsnapshot"),
  dbCreateAnalyticsnapshot: require("./dbCreateAnalyticsnapshot"),
  dbUpdateAnalyticsnapshot: require("./dbUpdateAnalyticsnapshot"),
  dbDeleteAnalyticsnapshot: require("./dbDeleteAnalyticsnapshot"),
  dbListAnalyticsnapshots: require("./dbListAnalyticsnapshots"),
  createAnalyticSnapshot: utils.createAnalyticSnapshot,
  getIdListOfAnalyticSnapshotByField: utils.getIdListOfAnalyticSnapshotByField,
  getAnalyticSnapshotById: utils.getAnalyticSnapshotById,
  getAnalyticSnapshotAggById: utils.getAnalyticSnapshotAggById,
  getAnalyticSnapshotListByQuery: utils.getAnalyticSnapshotListByQuery,
  getAnalyticSnapshotStatsByQuery: utils.getAnalyticSnapshotStatsByQuery,
  getAnalyticSnapshotByQuery: utils.getAnalyticSnapshotByQuery,
  updateAnalyticSnapshotById: utils.updateAnalyticSnapshotById,
  updateAnalyticSnapshotByIdList: utils.updateAnalyticSnapshotByIdList,
  updateAnalyticSnapshotByQuery: utils.updateAnalyticSnapshotByQuery,
  deleteAnalyticSnapshotById: utils.deleteAnalyticSnapshotById,
  deleteAnalyticSnapshotByQuery: utils.deleteAnalyticSnapshotByQuery,
};
