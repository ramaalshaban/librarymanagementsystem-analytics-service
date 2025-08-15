module.exports = (headers) => {
  // AnalyticSnapshot Db Object Rest Api Router
  const analyticSnapshotMcpRouter = [];
  // getAnalyticSnapshot controller
  analyticSnapshotMcpRouter.push(require("./get-analyticsnapshot")(headers));
  // createAnalyticSnapshot controller
  analyticSnapshotMcpRouter.push(require("./create-analyticsnapshot")(headers));
  // updateAnalyticSnapshot controller
  analyticSnapshotMcpRouter.push(require("./update-analyticsnapshot")(headers));
  // deleteAnalyticSnapshot controller
  analyticSnapshotMcpRouter.push(require("./delete-analyticsnapshot")(headers));
  // listAnalyticSnapshots controller
  analyticSnapshotMcpRouter.push(require("./list-analyticsnapshots")(headers));
  return analyticSnapshotMcpRouter;
};
