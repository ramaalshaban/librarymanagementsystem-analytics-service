const { ListAuditLogsManager } = require("managers");
const { z } = require("zod");

const AnalyticsMcpController = require("../../AnalyticsServiceMcpController");

class ListAuditLogsMcpController extends AnalyticsMcpController {
  constructor(params) {
    super("listAuditLogs", "listauditlogs", params);
    this.dataName = "auditLogs";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListAuditLogsManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        auditLogs: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            actorUserId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe("User (member/staff/admin) who performed the action."),
            actionType: z
              .string()
              .max(255)
              .describe(
                "Type/classification of action (create, update, delete, login, search, checkout, etc.)",
              ),
            targetObjectType: z
              .string()
              .max(255)
              .describe(
                "The primary object type affected by the action (loan, reservation, book, review, fee, etc).",
              ),
            targetObjectId: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "ID of the object affected by this event (loan id, book id, etc).",
              ),
            context: z
              .object()
              .optional()
              .nullable()
              .describe(
                "Flexible context object with additional key/value pairs related to the action.",
              ),
            note: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Optional annotation explaining the action, extra for compliance/audit.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Record of a system or user action for trace/audit purposes; stores user and source object, action, and context.",
          )
          .array(),
      })
      .describe("The response object of the crud route");
  }

  static getInputScheme() {
    return {
      accessToken: z
        .string()
        .optional()
        .describe(
          "The access token which is returned from a login request or given by user. This access token will override if there is any bearer or OAuth token in the mcp client. If not given the request will be made with the system (bearer or OAuth) token. For public routes you dont need to deifne any access token.",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "listAuditLogs",
    description: "List/filter audit logs (by action, user, object, time, etc).",
    parameters: ListAuditLogsMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listAuditLogsMcpController = new ListAuditLogsMcpController(
        mcpParams,
      );
      try {
        const result = await listAuditLogsMcpController.processRequest();
        //return ListAuditLogsMcpController.getOutputSchema().parse(result);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
        };
      } catch (err) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }
    },
  };
};
