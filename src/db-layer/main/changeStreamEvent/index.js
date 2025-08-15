const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbGetChangestreamevent: require("./dbGetChangestreamevent"),
  dbCreateChangestreamevent: require("./dbCreateChangestreamevent"),
  dbDeleteChangestreamevent: require("./dbDeleteChangestreamevent"),
  dbListChangestreamevents: require("./dbListChangestreamevents"),
  createChangeStreamEvent: utils.createChangeStreamEvent,
  getIdListOfChangeStreamEventByField:
    utils.getIdListOfChangeStreamEventByField,
  getChangeStreamEventById: utils.getChangeStreamEventById,
  getChangeStreamEventAggById: utils.getChangeStreamEventAggById,
  getChangeStreamEventListByQuery: utils.getChangeStreamEventListByQuery,
  getChangeStreamEventStatsByQuery: utils.getChangeStreamEventStatsByQuery,
  getChangeStreamEventByQuery: utils.getChangeStreamEventByQuery,
  updateChangeStreamEventById: utils.updateChangeStreamEventById,
  updateChangeStreamEventByIdList: utils.updateChangeStreamEventByIdList,
  updateChangeStreamEventByQuery: utils.updateChangeStreamEventByQuery,
  deleteChangeStreamEventById: utils.deleteChangeStreamEventById,
  deleteChangeStreamEventByQuery: utils.deleteChangeStreamEventByQuery,
};
