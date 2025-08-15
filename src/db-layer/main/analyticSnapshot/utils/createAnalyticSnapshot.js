const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { AnalyticSnapshot } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("analyticSnapshot");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = [
    "snapshotType",
    "scopeType",
    "timeRange",
    "data",
    "isActive",
  ];

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

const createAnalyticSnapshot = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForAnalyticSnapshot`);
    }

    validateData(data);

    const newanalyticSnapshot = new AnalyticSnapshot(data);
    const createdanalyticSnapshot = await newanalyticSnapshot.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdanalyticSnapshot.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(
      `errMsg_dbErrorWhenCreatingAnalyticSnapshot`,
      err,
    );
  }
};

module.exports = createAnalyticSnapshot;
