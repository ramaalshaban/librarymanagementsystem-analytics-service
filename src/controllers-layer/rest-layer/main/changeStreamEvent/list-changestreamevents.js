const { ListChangeStreamEventsManager } = require("managers");

const AnalyticsRestController = require("../../AnalyticsServiceRestController");

class ListChangeStreamEventsRestController extends AnalyticsRestController {
  constructor(req, res) {
    super("listChangeStreamEvents", "listchangestreamevents", req, res);
    this.dataName = "changeStreamEvents";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListChangeStreamEventsManager(this._req, "rest");
  }
}

const listChangeStreamEvents = async (req, res, next) => {
  const listChangeStreamEventsRestController =
    new ListChangeStreamEventsRestController(req, res);
  try {
    await listChangeStreamEventsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listChangeStreamEvents;
