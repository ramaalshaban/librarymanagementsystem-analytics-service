const { mongoose } = require("common");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");

const analyticsnapshotSchema = require("./analyticSnapshot");

const auditlogSchema = require("./auditLog");

const changestreameventSchema = require("./changeStreamEvent");

analyticsnapshotSchema.methods.getCqrsJoins = async function (data) {};

analyticsnapshotSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  const scopeTypeOptions = ["personal", "branch", "global"];
  if (ret.scopeType != null) {
    const enumIndex =
      typeof ret.scopeType === "string"
        ? scopeTypeOptions.indexOf(ret.scopeType)
        : ret.scopeType;
    ret.scopeType_idx = enumIndex;
    ret.scopeType = enumIndex > -1 ? scopeTypeOptions[enumIndex] : undefined;
  }

  return ret;
};

auditlogSchema.methods.getCqrsJoins = async function (data) {};

auditlogSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  return ret;
};

changestreameventSchema.methods.getCqrsJoins = async function (data) {};

changestreameventSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  return ret;
};

const AnalyticSnapshot = mongoose.model(
  "AnalyticSnapshot",
  analyticsnapshotSchema,
);
const AuditLog = mongoose.model("AuditLog", auditlogSchema);
const ChangeStreamEvent = mongoose.model(
  "ChangeStreamEvent",
  changestreameventSchema,
);

module.exports = {
  AnalyticSnapshot,
  AuditLog,
  ChangeStreamEvent,
  updateElasticIndexMappings,
};
