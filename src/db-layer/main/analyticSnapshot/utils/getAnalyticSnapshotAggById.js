const { HttpServerError } = require("common");

const { AnalyticSnapshot } = require("models");

const getAnalyticSnapshotAggById = async (analyticSnapshotId) => {
  try {
    let analyticSnapshotQuery;

    if (Array.isArray(analyticSnapshotId)) {
      analyticSnapshotQuery = AnalyticSnapshot.find({
        _id: { $in: analyticSnapshotId },
        isActive: true,
      });
    } else {
      analyticSnapshotQuery = AnalyticSnapshot.findOne({
        _id: analyticSnapshotId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const analyticSnapshot = await analyticSnapshotQuery.exec();

    if (!analyticSnapshot) {
      return null;
    }
    const analyticSnapshotData =
      Array.isArray(analyticSnapshotId) && analyticSnapshotId.length > 0
        ? analyticSnapshot.map((item) => item.getData())
        : analyticSnapshot.getData();

    // should i add this here?
    await AnalyticSnapshot.getCqrsJoins(analyticSnapshotData);

    return analyticSnapshotData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAnalyticSnapshotAggById",
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

module.exports = getAnalyticSnapshotAggById;
