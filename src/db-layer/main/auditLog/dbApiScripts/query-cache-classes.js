const { QueryCache, QueryCacheInvalidator } = require("common");

class AuditLogQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("auditLog", [], "$and", "$eq", input, wClause);
  }
}
class AuditLogQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("auditLog", []);
  }
}

module.exports = {
  AuditLogQueryCache,
  AuditLogQueryCacheInvalidator,
};
