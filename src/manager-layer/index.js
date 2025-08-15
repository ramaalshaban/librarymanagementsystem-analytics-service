module.exports = {
  AnalyticsServiceManager: require("./service-manager/AnalyticsServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // AnalyticSnapshot Db Object
  GetAnalyticSnapshotManager: require("./main/analyticSnapshot/get-analyticsnapshot"),
  CreateAnalyticSnapshotManager: require("./main/analyticSnapshot/create-analyticsnapshot"),
  UpdateAnalyticSnapshotManager: require("./main/analyticSnapshot/update-analyticsnapshot"),
  DeleteAnalyticSnapshotManager: require("./main/analyticSnapshot/delete-analyticsnapshot"),
  ListAnalyticSnapshotsManager: require("./main/analyticSnapshot/list-analyticsnapshots"),
  // AuditLog Db Object
  GetAuditLogManager: require("./main/auditLog/get-auditlog"),
  CreateAuditLogManager: require("./main/auditLog/create-auditlog"),
  UpdateAuditLogManager: require("./main/auditLog/update-auditlog"),
  DeleteAuditLogManager: require("./main/auditLog/delete-auditlog"),
  ListAuditLogsManager: require("./main/auditLog/list-auditlogs"),
  // ChangeStreamEvent Db Object
  GetChangeStreamEventManager: require("./main/changeStreamEvent/get-changestreamevent"),
  CreateChangeStreamEventManager: require("./main/changeStreamEvent/create-changestreamevent"),
  DeleteChangeStreamEventManager: require("./main/changeStreamEvent/delete-changestreamevent"),
  ListChangeStreamEventsManager: require("./main/changeStreamEvent/list-changestreamevents"),
};
