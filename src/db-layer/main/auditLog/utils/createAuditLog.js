const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { AuditLog } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("auditLog");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = ["actionType", "targetObjectType", "isActive"];

  requiredFields.forEach((field) => {
    if (data[field] === null || data[field] === undefined) {
      throw new BadRequestError(
        `Field "${field}" is required and cannot be null or undefined.`,
      );
    }
  });

  if (!data._id && !data.id) {
    data._id = newUUID();
  }
};

const createAuditLog = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForAuditLog`);
    }

    validateData(data);

    const newauditLog = new AuditLog(data);
    const createdauditLog = await newauditLog.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdauditLog.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(`errMsg_dbErrorWhenCreatingAuditLog`, err);
  }
};

module.exports = createAuditLog;
