const { CreateChangeStreamEventManager } = require("managers");

const AnalyticsRestController = require("../../AnalyticsServiceRestController");

class CreateChangeStreamEventRestController extends AnalyticsRestController {
  constructor(req, res) {
    super("createChangeStreamEvent", "createchangestreamevent", req, res);
    this.dataName = "changeStreamEvent";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateChangeStreamEventManager(this._req, "rest");
  }
}

const createChangeStreamEvent = async (req, res, next) => {
  const createChangeStreamEventRestController =
    new CreateChangeStreamEventRestController(req, res);
  try {
    await createChangeStreamEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createChangeStreamEvent;
