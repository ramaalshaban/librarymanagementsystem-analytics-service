const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { ChangeStreamEvent } = require("models");

const getIdListOfChangeStreamEventByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    const changeStreamEventProperties = [
      "id",
      "streamName",
      "payload",
      "sourceObject",
    ];

    if (!changeStreamEventProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = ChangeStreamEvent.schema.paths[fieldName];
    if (schemaPath && fieldValue !== undefined && fieldValue !== null) {
      const expectedType = schemaPath.instance.toLowerCase();
      const actualType = typeof fieldValue;

      const typeMapping = {
        string: "string",
        number: "number",
        boolean: "boolean",
        objectid: "string", // ObjectIds are typically passed as strings
      };

      const expectedJSType = typeMapping[expectedType];
      if (expectedJSType && actualType !== expectedJSType) {
        throw new BadRequestError(
          `Invalid field value type for ${fieldName}. Expected ${expectedJSType}, got ${actualType}.`,
        );
      }
    }

    let query = isArray
      ? {
          [fieldName]: {
            $in: Array.isArray(fieldValue) ? fieldValue : [fieldValue],
          },
        }
      : { [fieldName]: fieldValue };

    query.isActive = true;

    let changeStreamEventIdList = await ChangeStreamEvent.find(query, {
      _id: 1,
    })
      .lean()
      .exec();

    if (!changeStreamEventIdList || changeStreamEventIdList.length === 0) {
      throw new NotFoundError(
        `ChangeStreamEvent with the specified criteria not found`,
      );
    }

    changeStreamEventIdList = changeStreamEventIdList.map((item) =>
      item._id.toString(),
    );

    return changeStreamEventIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingChangeStreamEventIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfChangeStreamEventByField;
