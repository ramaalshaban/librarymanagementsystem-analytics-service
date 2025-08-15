const { DeleteChangeStreamEventManager } = require("managers");

const AnalyticsRestController = require("../../AnalyticsServiceRestController");

class DeleteChangeStreamEventRestController extends AnalyticsRestController {
  constructor(req, res) {
    super("deleteChangeStreamEvent", "deletechangestreamevent", req, res);
    this.dataName = "changeStreamEvent";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteChangeStreamEventManager(this._req, "rest");
  }
}

const deleteChangeStreamEvent = async (req, res, next) => {
  const deleteChangeStreamEventRestController =
    new DeleteChangeStreamEventRestController(req, res);
  try {
    await deleteChangeStreamEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteChangeStreamEvent;
