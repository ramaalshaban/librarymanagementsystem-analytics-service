const { QueryCache, QueryCacheInvalidator } = require("common");

class ChangeStreamEventQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("changeStreamEvent", [], "$and", "$eq", input, wClause);
  }
}
class ChangeStreamEventQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("changeStreamEvent", []);
  }
}

module.exports = {
  ChangeStreamEventQueryCache,
  ChangeStreamEventQueryCacheInvalidator,
};
