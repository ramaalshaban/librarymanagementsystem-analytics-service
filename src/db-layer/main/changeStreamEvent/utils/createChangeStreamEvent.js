const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { ChangeStreamEvent } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("changeStreamEvent");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = ["streamName", "payload", "isActive"];

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

const createChangeStreamEvent = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForChangeStreamEvent`);
    }

    validateData(data);

    const newchangeStreamEvent = new ChangeStreamEvent(data);
    const createdchangeStreamEvent = await newchangeStreamEvent.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdchangeStreamEvent.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(
      `errMsg_dbErrorWhenCreatingChangeStreamEvent`,
      err,
    );
  }
};

module.exports = createChangeStreamEvent;
