const { QueryCache, QueryCacheInvalidator } = require("common");

class AnalyticSnapshotQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("analyticSnapshot", [], "$and", "$eq", input, wClause);
  }
}
class AnalyticSnapshotQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("analyticSnapshot", []);
  }
}

module.exports = {
  AnalyticSnapshotQueryCache,
  AnalyticSnapshotQueryCacheInvalidator,
};
