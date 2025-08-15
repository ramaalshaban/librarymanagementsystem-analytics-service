const express = require("express");

// AnalyticSnapshot Db Object Rest Api Router
const analyticSnapshotRouter = express.Router();

// add AnalyticSnapshot controllers

// getAnalyticSnapshot controller
analyticSnapshotRouter.get(
  "/analyticsnapshots/:analyticSnapshotId",
  require("./get-analyticsnapshot"),
);
// createAnalyticSnapshot controller
analyticSnapshotRouter.post(
  "/analyticsnapshots",
  require("./create-analyticsnapshot"),
);
// updateAnalyticSnapshot controller
analyticSnapshotRouter.patch(
  "/analyticsnapshots/:analyticSnapshotId",
  require("./update-analyticsnapshot"),
);
// deleteAnalyticSnapshot controller
analyticSnapshotRouter.delete(
  "/analyticsnapshots/:analyticSnapshotId",
  require("./delete-analyticsnapshot"),
);
// listAnalyticSnapshots controller
analyticSnapshotRouter.get(
  "/analyticsnapshots",
  require("./list-analyticsnapshots"),
);

module.exports = analyticSnapshotRouter;
