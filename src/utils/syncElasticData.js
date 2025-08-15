const {
  getAnalyticSnapshotById,
  getIdListOfAnalyticSnapshotByField,
} = require("dbLayer");
const { getAuditLogById, getIdListOfAuditLogByField } = require("dbLayer");
const {
  getChangeStreamEventById,
  getIdListOfChangeStreamEventByField,
} = require("dbLayer");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");

const indexAnalyticSnapshotData = async () => {
  const analyticSnapshotIndexer = new ElasticIndexer("analyticSnapshot", {
    isSilent: true,
  });
  console.log("Starting to update indexes for AnalyticSnapshot");

  const idList =
    (await getIdListOfAnalyticSnapshotByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getAnalyticSnapshotById(chunk);
    if (dataList.length) {
      await analyticSnapshotIndexer.indexBulkData(dataList);
      await analyticSnapshotIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexAuditLogData = async () => {
  const auditLogIndexer = new ElasticIndexer("auditLog", { isSilent: true });
  console.log("Starting to update indexes for AuditLog");

  const idList = (await getIdListOfAuditLogByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getAuditLogById(chunk);
    if (dataList.length) {
      await auditLogIndexer.indexBulkData(dataList);
      await auditLogIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexChangeStreamEventData = async () => {
  const changeStreamEventIndexer = new ElasticIndexer("changeStreamEvent", {
    isSilent: true,
  });
  console.log("Starting to update indexes for ChangeStreamEvent");

  const idList =
    (await getIdListOfChangeStreamEventByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getChangeStreamEventById(chunk);
    if (dataList.length) {
      await changeStreamEventIndexer.indexBulkData(dataList);
      await changeStreamEventIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexAnalyticSnapshotData();
    console.log(
      "AnalyticSnapshot agregated data is indexed, total analyticSnapshots:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing AnalyticSnapshot data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexAuditLogData();
    console.log(
      "AuditLog agregated data is indexed, total auditLogs:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing AuditLog data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexChangeStreamEventData();
    console.log(
      "ChangeStreamEvent agregated data is indexed, total changeStreamEvents:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing ChangeStreamEvent data",
      err.toString(),
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;
