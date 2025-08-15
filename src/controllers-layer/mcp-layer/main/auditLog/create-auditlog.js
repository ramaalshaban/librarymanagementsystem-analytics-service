const { CreateAuditLogManager } = require("managers");
const { z } = require("zod");

const AnalyticsMcpController = require("../../AnalyticsServiceMcpController");

class CreateAuditLogMcpController extends AnalyticsMcpController {
  constructor(params) {
    super("createAuditLog", "createauditlog", params);
    this.dataName = "auditLog";
    this.crudType = "create";
  }

  createApiManager() {
    return new CreateAuditLogManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        auditLog: z
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
          ),
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
      actorUserId: z
        .string()
        .uuid()
        .optional()
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
        .describe(
          "ID of the object affected by this event (loan id, book id, etc).",
        ),

      context: z
        .object({})
        .optional()
        .describe(
          "Flexible context object with additional key/value pairs related to the action.",
        ),

      note: z
        .string()
        .optional()
        .describe(
          "Optional annotation explaining the action, extra for compliance/audit.",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "createAuditLog",
    description:
      "Create a new audit log record for trace, compliance, and review.",
    parameters: CreateAuditLogMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const createAuditLogMcpController = new CreateAuditLogMcpController(
        mcpParams,
      );
      try {
        const result = await createAuditLogMcpController.processRequest();
        //return CreateAuditLogMcpController.getOutputSchema().parse(result);
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
