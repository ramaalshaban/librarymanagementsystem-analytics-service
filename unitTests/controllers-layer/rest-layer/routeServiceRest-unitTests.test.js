const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//For these tests to work we need to export GetAnalyticSnapshotRestController also from file getanalyticsnapshot.js
describe("GetAnalyticSnapshotRestController", () => {
  let GetAnalyticSnapshotRestController, getAnalyticSnapshot;
  let GetAnalyticSnapshotManagerStub, processRequestStub;
  let req, res, next;

  beforeEach(() => {
    req = { requestId: "req-456" };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub();

    // Stub for GetAnalyticSnapshotManager constructor
    GetAnalyticSnapshotManagerStub = sinon.stub();

    // Stub for processRequest inherited from RestController
    processRequestStub = sinon.stub();

    // Proxyquire module under test with mocks
    ({ GetAnalyticSnapshotRestController, getAnalyticSnapshot } = proxyquire(
      "../../../src/controllers-layer/rest-layer/main/analyticSnapshot/get-analyticsnapshot.js",
      {
        serviceCommon: {
          HexaLogTypes: {},
          hexaLogger: { insertInfo: sinon.stub(), insertError: sinon.stub() },
        },
        managers: {
          GetAnalyticSnapshotManager: GetAnalyticSnapshotManagerStub,
        },
        "../../AnalyticsServiceRestController": class {
          constructor(name, routeName, _req, _res, _next) {
            this.name = name;
            this.routeName = routeName;
            this._req = _req;
            this._res = _res;
            this._next = _next;
            this.processRequest = processRequestStub;
          }
        },
      },
    ));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("GetAnalyticSnapshotRestController class", () => {
    it("should extend RestController with correct values", () => {
      const controller = new GetAnalyticSnapshotRestController(req, res, next);

      expect(controller.name).to.equal("getAnalyticSnapshot");
      expect(controller.routeName).to.equal("getanalyticsnapshot");
      expect(controller.dataName).to.equal("analyticSnapshot");
      expect(controller.crudType).to.equal("get");
      expect(controller.status).to.equal(200);
      expect(controller.httpMethod).to.equal("GET");
    });

    it("should create GetAnalyticSnapshotManager in createApiManager()", () => {
      const controller = new GetAnalyticSnapshotRestController(req, res, next);
      controller._req = req;

      controller.createApiManager();

      expect(GetAnalyticSnapshotManagerStub.calledOnceWithExactly(req, "rest"))
        .to.be.true;
    });
  });

  describe("getAnalyticSnapshot function", () => {
    it("should create instance and call processRequest", async () => {
      await getAnalyticSnapshot(req, res, next);

      expect(processRequestStub.calledOnce).to.be.true;
    });
  });
});
