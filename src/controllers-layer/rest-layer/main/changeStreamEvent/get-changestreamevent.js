const { GetChangeStreamEventManager } = require("managers");

const AnalyticsRestController = require("../../AnalyticsServiceRestController");

class GetChangeStreamEventRestController extends AnalyticsRestController {
  constructor(req, res) {
    super("getChangeStreamEvent", "getchangestreamevent", req, res);
    this.dataName = "changeStreamEvent";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetChangeStreamEventManager(this._req, "rest");
  }
}

const getChangeStreamEvent = async (req, res, next) => {
  const getChangeStreamEventRestController =
    new GetChangeStreamEventRestController(req, res);
  try {
    await getChangeStreamEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getChangeStreamEvent;
