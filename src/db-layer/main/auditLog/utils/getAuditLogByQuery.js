const { HttpServerError, BadRequestError } = require("common");

const { AuditLog } = require("models");

const getAuditLogByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const auditLog = await AuditLog.findOne({
      ...query,
      isActive: true,
    });

    if (!auditLog) return null;

    return auditLog.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAuditLogByQuery",
      err,
    );
  }
};

module.exports = getAuditLogByQuery;
