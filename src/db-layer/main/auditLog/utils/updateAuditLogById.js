const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { AuditLog } = require("models");
const { ElasticIndexer } = require("serviceCommon");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("auditLog");
  await elasticIndexer.indexData(data);
};

const updateAuditLogById = async (id, dataClause) => {
  try {
    if (!id && dataClause.id) {
      id = dataClause.id;
      delete dataClause.id;
    }

    if (typeof id === "object") {
      if (!dataClause) dataClause = id;
      id = id.id;
      delete dataClause.id;
    }

    if (!id)
      throw new BadRequestError("ID is required in utility update function");

    const existingDoc = await AuditLog.findOne({ _id: id, isActive: true });

    if (!existingDoc) {
      throw new NotFoundError(`Record with ID ${id} not found.`);
    }

    const options = { new: true };

    const whereClause = { _id: id, isActive: true };

    const dbDoc = await AuditLog.findOneAndUpdate(
      whereClause,
      dataClause,
      options,
    );

    if (!dbDoc) {
      throw new NotFoundError("Record not found for update.");
    }

    const _data = dbDoc.getData();
    await indexDataToElastic(_data);
    return _data;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingAuditLogById", err);
  }
};

module.exports = updateAuditLogById;
