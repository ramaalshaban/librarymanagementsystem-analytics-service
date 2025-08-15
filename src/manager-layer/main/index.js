module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // AnalyticSnapshot Db Object
  GetAnalyticSnapshotManager: require("./analyticSnapshot/get-analyticsnapshot"),
  CreateAnalyticSnapshotManager: require("./analyticSnapshot/create-analyticsnapshot"),
  UpdateAnalyticSnapshotManager: require("./analyticSnapshot/update-analyticsnapshot"),
  DeleteAnalyticSnapshotManager: require("./analyticSnapshot/delete-analyticsnapshot"),
  ListAnalyticSnapshotsManager: require("./analyticSnapshot/list-analyticsnapshots"),
  // AuditLog Db Object
  GetAuditLogManager: require("./auditLog/get-auditlog"),
  CreateAuditLogManager: require("./auditLog/create-auditlog"),
  UpdateAuditLogManager: require("./auditLog/update-auditlog"),
  DeleteAuditLogManager: require("./auditLog/delete-auditlog"),
  ListAuditLogsManager: require("./auditLog/list-auditlogs"),
  // ChangeStreamEvent Db Object
  GetChangeStreamEventManager: require("./changeStreamEvent/get-changestreamevent"),
  CreateChangeStreamEventManager: require("./changeStreamEvent/create-changestreamevent"),
  DeleteChangeStreamEventManager: require("./changeStreamEvent/delete-changestreamevent"),
  ListChangeStreamEventsManager: require("./changeStreamEvent/list-changestreamevents"),
};
