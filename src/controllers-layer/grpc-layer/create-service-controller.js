const AnalyticsServiceGrpcController = require("./AnalyticsServiceGrpcController");

module.exports = (name, routeName, call, callback) => {
  const grpcController = new AnalyticsServiceGrpcController(
    name,
    routeName,
    call,
    callback,
  );
  return grpcController;
};
