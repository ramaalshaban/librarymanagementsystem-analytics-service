const { HttpServerError } = require("common");

const { AuditLog } = require("models");

const getAuditLogById = async (auditLogId) => {
  try {
    let auditLog;

    if (Array.isArray(auditLogId)) {
      auditLog = await AuditLog.find({
        _id: { $in: auditLogId },
        isActive: true,
      });
    } else {
      auditLog = await AuditLog.findOne({
        _id: auditLogId,
        isActive: true,
      });
    }

    if (!auditLog) {
      return null;
    }

    return Array.isArray(auditLogId)
      ? auditLog.map((item) => item.getData())
      : auditLog.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingAuditLogById", err);
  }
};

module.exports = getAuditLogById;
