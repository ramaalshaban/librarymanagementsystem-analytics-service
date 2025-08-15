const mainFunctions = require("./main");

module.exports = {
  // main Database
  // AnalyticSnapshot Db Object
  dbGetAnalyticsnapshot: mainFunctions.dbGetAnalyticsnapshot,
  dbCreateAnalyticsnapshot: mainFunctions.dbCreateAnalyticsnapshot,
  dbUpdateAnalyticsnapshot: mainFunctions.dbUpdateAnalyticsnapshot,
  dbDeleteAnalyticsnapshot: mainFunctions.dbDeleteAnalyticsnapshot,
  dbListAnalyticsnapshots: mainFunctions.dbListAnalyticsnapshots,
  createAnalyticSnapshot: mainFunctions.createAnalyticSnapshot,
  getIdListOfAnalyticSnapshotByField:
    mainFunctions.getIdListOfAnalyticSnapshotByField,
  getAnalyticSnapshotById: mainFunctions.getAnalyticSnapshotById,
  getAnalyticSnapshotAggById: mainFunctions.getAnalyticSnapshotAggById,
  getAnalyticSnapshotListByQuery: mainFunctions.getAnalyticSnapshotListByQuery,
  getAnalyticSnapshotStatsByQuery:
    mainFunctions.getAnalyticSnapshotStatsByQuery,
  getAnalyticSnapshotByQuery: mainFunctions.getAnalyticSnapshotByQuery,
  updateAnalyticSnapshotById: mainFunctions.updateAnalyticSnapshotById,
  updateAnalyticSnapshotByIdList: mainFunctions.updateAnalyticSnapshotByIdList,
  updateAnalyticSnapshotByQuery: mainFunctions.updateAnalyticSnapshotByQuery,
  deleteAnalyticSnapshotById: mainFunctions.deleteAnalyticSnapshotById,
  deleteAnalyticSnapshotByQuery: mainFunctions.deleteAnalyticSnapshotByQuery,

  // AuditLog Db Object
  dbGetAuditlog: mainFunctions.dbGetAuditlog,
  dbCreateAuditlog: mainFunctions.dbCreateAuditlog,
  dbUpdateAuditlog: mainFunctions.dbUpdateAuditlog,
  dbDeleteAuditlog: mainFunctions.dbDeleteAuditlog,
  dbListAuditlogs: mainFunctions.dbListAuditlogs,
  createAuditLog: mainFunctions.createAuditLog,
  getIdListOfAuditLogByField: mainFunctions.getIdListOfAuditLogByField,
  getAuditLogById: mainFunctions.getAuditLogById,
  getAuditLogAggById: mainFunctions.getAuditLogAggById,
  getAuditLogListByQuery: mainFunctions.getAuditLogListByQuery,
  getAuditLogStatsByQuery: mainFunctions.getAuditLogStatsByQuery,
  getAuditLogByQuery: mainFunctions.getAuditLogByQuery,
  updateAuditLogById: mainFunctions.updateAuditLogById,
  updateAuditLogByIdList: mainFunctions.updateAuditLogByIdList,
  updateAuditLogByQuery: mainFunctions.updateAuditLogByQuery,
  deleteAuditLogById: mainFunctions.deleteAuditLogById,
  deleteAuditLogByQuery: mainFunctions.deleteAuditLogByQuery,

  // ChangeStreamEvent Db Object
  dbGetChangestreamevent: mainFunctions.dbGetChangestreamevent,
  dbCreateChangestreamevent: mainFunctions.dbCreateChangestreamevent,
  dbDeleteChangestreamevent: mainFunctions.dbDeleteChangestreamevent,
  dbListChangestreamevents: mainFunctions.dbListChangestreamevents,
  createChangeStreamEvent: mainFunctions.createChangeStreamEvent,
  getIdListOfChangeStreamEventByField:
    mainFunctions.getIdListOfChangeStreamEventByField,
  getChangeStreamEventById: mainFunctions.getChangeStreamEventById,
  getChangeStreamEventAggById: mainFunctions.getChangeStreamEventAggById,
  getChangeStreamEventListByQuery:
    mainFunctions.getChangeStreamEventListByQuery,
  getChangeStreamEventStatsByQuery:
    mainFunctions.getChangeStreamEventStatsByQuery,
  getChangeStreamEventByQuery: mainFunctions.getChangeStreamEventByQuery,
  updateChangeStreamEventById: mainFunctions.updateChangeStreamEventById,
  updateChangeStreamEventByIdList:
    mainFunctions.updateChangeStreamEventByIdList,
  updateChangeStreamEventByQuery: mainFunctions.updateChangeStreamEventByQuery,
  deleteChangeStreamEventById: mainFunctions.deleteChangeStreamEventById,
  deleteChangeStreamEventByQuery: mainFunctions.deleteChangeStreamEventByQuery,
};
