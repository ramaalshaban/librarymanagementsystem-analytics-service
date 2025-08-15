const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const analyticSnapshotMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  snapshotType: { type: "keyword", index: true },
  scopeType: { type: "keyword", index: true },
  scopeType_: { type: "keyword" },
  scopeId: { type: "keyword", index: true },
  timeRange: { type: "object", enabled: false },
  data: { type: "object", enabled: false },
  generatedBy: { type: "keyword", index: false },
  note: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const auditLogMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  actorUserId: { type: "keyword", index: true },
  actionType: { type: "keyword", index: true },
  targetObjectType: { type: "keyword", index: true },
  targetObjectId: { type: "keyword", index: false },
  context: { type: "object", enabled: false },
  note: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const changeStreamEventMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  streamName: { type: "keyword", index: false },
  payload: { type: "object", enabled: false },
  sourceObject: { type: "keyword", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("analyticSnapshot", analyticSnapshotMapping);
    await new ElasticIndexer("analyticSnapshot").updateMapping(
      analyticSnapshotMapping,
    );
    ElasticIndexer.addMapping("auditLog", auditLogMapping);
    await new ElasticIndexer("auditLog").updateMapping(auditLogMapping);
    ElasticIndexer.addMapping("changeStreamEvent", changeStreamEventMapping);
    await new ElasticIndexer("changeStreamEvent").updateMapping(
      changeStreamEventMapping,
    );
  } catch (err) {
    hexaLogger.insertError(
      "UpdateElasticIndexMappingsError",
      { function: "updateElasticIndexMappings" },
      "elastic-index.js->updateElasticIndexMappings",
      err,
    );
  }
};

module.exports = updateElasticIndexMappings;
