const { HttpServerError } = require("common");

const { ChangeStreamEvent } = require("models");

const getChangeStreamEventAggById = async (changeStreamEventId) => {
  try {
    let changeStreamEventQuery;

    if (Array.isArray(changeStreamEventId)) {
      changeStreamEventQuery = ChangeStreamEvent.find({
        _id: { $in: changeStreamEventId },
        isActive: true,
      });
    } else {
      changeStreamEventQuery = ChangeStreamEvent.findOne({
        _id: changeStreamEventId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const changeStreamEvent = await changeStreamEventQuery.exec();

    if (!changeStreamEvent) {
      return null;
    }
    const changeStreamEventData =
      Array.isArray(changeStreamEventId) && changeStreamEventId.length > 0
        ? changeStreamEvent.map((item) => item.getData())
        : changeStreamEvent.getData();

    // should i add this here?
    await ChangeStreamEvent.getCqrsJoins(changeStreamEventData);

    return changeStreamEventData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingChangeStreamEventAggById",
      err,
    );
  }
};

// "__PropertyEnumSettings.doc": "Enum configuration for the data property, applicable when the property type is set to Enum. While enum values are stored as integers in the database, defining the enum options here allows Mindbricks to enrich API responses with human-readable labels, easing interpretation and UI integration. If not defined, only the numeric value will be returned.",
// "PropertyEnumSettings": {
//   "__hasEnumOptions.doc": "Enables support for named enum values when the property type is Enum. Though values are stored as integers, enabling this adds the symbolic name to API responses for clarity.",
//   "__config.doc": "The configuration object for enum options. Leave it null if hasEnumOptions is false.",
//   "__activation": "hasEnumOptions",
//  "__lines": "\
//  a-hasEnumOptions\
//  g-config",
//  "hasEnumOptions": "Boolean",
//  "config": "PropertyEnumSettingsConfig"
//},

module.exports = getChangeStreamEventAggById;
