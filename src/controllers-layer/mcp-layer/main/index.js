module.exports = (headers) => {
  // main Database Crud Object Mcp Api Routers
  return {
    analyticSnapshotMcpRouter: require("./analyticSnapshot")(headers),
    auditLogMcpRouter: require("./auditLog")(headers),
    changeStreamEventMcpRouter: require("./changeStreamEvent")(headers),
  };
};
