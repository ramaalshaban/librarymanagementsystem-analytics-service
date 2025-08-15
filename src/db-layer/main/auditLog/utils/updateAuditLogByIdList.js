const { HttpServerError } = require("common");

const { AuditLog } = require("models");

const updateAuditLogByIdList = async (idList, dataClause) => {
  try {
    await AuditLog.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await AuditLog.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const auditLogIdList = updatedDocs.map((doc) => doc._id);

    return auditLogIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingAuditLogByIdList",
      err,
    );
  }
};

module.exports = updateAuditLogByIdList;
