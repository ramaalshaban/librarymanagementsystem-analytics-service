const analyticSnapshotFunctions = require("./analyticSnapshot");
const auditLogFunctions = require("./auditLog");
const changeStreamEventFunctions = require("./changeStreamEvent");

module.exports = {
  // main Database
  // AnalyticSnapshot Db Object
  dbGetAnalyticsnapshot: analyticSnapshotFunctions.dbGetAnalyticsnapshot,
  dbCreateAnalyticsnapshot: analyticSnapshotFunctions.dbCreateAnalyticsnapshot,
  dbUpdateAnalyticsnapshot: analyticSnapshotFunctions.dbUpdateAnalyticsnapshot,
  dbDeleteAnalyticsnapshot: analyticSnapshotFunctions.dbDeleteAnalyticsnapshot,
  dbListAnalyticsnapshots: analyticSnapshotFunctions.dbListAnalyticsnapshots,
  createAnalyticSnapshot: analyticSnapshotFunctions.createAnalyticSnapshot,
  getIdListOfAnalyticSnapshotByField:
    analyticSnapshotFunctions.getIdListOfAnalyticSnapshotByField,
  getAnalyticSnapshotById: analyticSnapshotFunctions.getAnalyticSnapshotById,
  getAnalyticSnapshotAggById:
    analyticSnapshotFunctions.getAnalyticSnapshotAggById,
  getAnalyticSnapshotListByQuery:
    analyticSnapshotFunctions.getAnalyticSnapshotListByQuery,
  getAnalyticSnapshotStatsByQuery:
    analyticSnapshotFunctions.getAnalyticSnapshotStatsByQuery,
  getAnalyticSnapshotByQuery:
    analyticSnapshotFunctions.getAnalyticSnapshotByQuery,
  updateAnalyticSnapshotById:
    analyticSnapshotFunctions.updateAnalyticSnapshotById,
  updateAnalyticSnapshotByIdList:
    analyticSnapshotFunctions.updateAnalyticSnapshotByIdList,
  updateAnalyticSnapshotByQuery:
    analyticSnapshotFunctions.updateAnalyticSnapshotByQuery,
  deleteAnalyticSnapshotById:
    analyticSnapshotFunctions.deleteAnalyticSnapshotById,
  deleteAnalyticSnapshotByQuery:
    analyticSnapshotFunctions.deleteAnalyticSnapshotByQuery,

  // AuditLog Db Object
  dbGetAuditlog: auditLogFunctions.dbGetAuditlog,
  dbCreateAuditlog: auditLogFunctions.dbCreateAuditlog,
  dbUpdateAuditlog: auditLogFunctions.dbUpdateAuditlog,
  dbDeleteAuditlog: auditLogFunctions.dbDeleteAuditlog,
  dbListAuditlogs: auditLogFunctions.dbListAuditlogs,
  createAuditLog: auditLogFunctions.createAuditLog,
  getIdListOfAuditLogByField: auditLogFunctions.getIdListOfAuditLogByField,
  getAuditLogById: auditLogFunctions.getAuditLogById,
  getAuditLogAggById: auditLogFunctions.getAuditLogAggById,
  getAuditLogListByQuery: auditLogFunctions.getAuditLogListByQuery,
  getAuditLogStatsByQuery: auditLogFunctions.getAuditLogStatsByQuery,
  getAuditLogByQuery: auditLogFunctions.getAuditLogByQuery,
  updateAuditLogById: auditLogFunctions.updateAuditLogById,
  updateAuditLogByIdList: auditLogFunctions.updateAuditLogByIdList,
  updateAuditLogByQuery: auditLogFunctions.updateAuditLogByQuery,
  deleteAuditLogById: auditLogFunctions.deleteAuditLogById,
  deleteAuditLogByQuery: auditLogFunctions.deleteAuditLogByQuery,

  // ChangeStreamEvent Db Object
  dbGetChangestreamevent: changeStreamEventFunctions.dbGetChangestreamevent,
  dbCreateChangestreamevent:
    changeStreamEventFunctions.dbCreateChangestreamevent,
  dbDeleteChangestreamevent:
    changeStreamEventFunctions.dbDeleteChangestreamevent,
  dbListChangestreamevents: changeStreamEventFunctions.dbListChangestreamevents,
  createChangeStreamEvent: changeStreamEventFunctions.createChangeStreamEvent,
  getIdListOfChangeStreamEventByField:
    changeStreamEventFunctions.getIdListOfChangeStreamEventByField,
  getChangeStreamEventById: changeStreamEventFunctions.getChangeStreamEventById,
  getChangeStreamEventAggById:
    changeStreamEventFunctions.getChangeStreamEventAggById,
  getChangeStreamEventListByQuery:
    changeStreamEventFunctions.getChangeStreamEventListByQuery,
  getChangeStreamEventStatsByQuery:
    changeStreamEventFunctions.getChangeStreamEventStatsByQuery,
  getChangeStreamEventByQuery:
    changeStreamEventFunctions.getChangeStreamEventByQuery,
  updateChangeStreamEventById:
    changeStreamEventFunctions.updateChangeStreamEventById,
  updateChangeStreamEventByIdList:
    changeStreamEventFunctions.updateChangeStreamEventByIdList,
  updateChangeStreamEventByQuery:
    changeStreamEventFunctions.updateChangeStreamEventByQuery,
  deleteChangeStreamEventById:
    changeStreamEventFunctions.deleteChangeStreamEventById,
  deleteChangeStreamEventByQuery:
    changeStreamEventFunctions.deleteChangeStreamEventByQuery,
};
