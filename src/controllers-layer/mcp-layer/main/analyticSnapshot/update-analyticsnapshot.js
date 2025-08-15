const { UpdateAnalyticSnapshotManager } = require("managers");
const { z } = require("zod");

const AnalyticsMcpController = require("../../AnalyticsServiceMcpController");

class UpdateAnalyticSnapshotMcpController extends AnalyticsMcpController {
  constructor(params) {
    super("updateAnalyticSnapshot", "updateanalyticsnapshot", params);
    this.dataName = "analyticSnapshot";
    this.crudType = "update";
  }

  createApiManager() {
    return new UpdateAnalyticSnapshotManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        analyticSnapshot: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            snapshotType: z
              .string()
              .max(255)
              .describe(
                "Type of analytic metric (borrowing, trend, compliance, systemLoad, engagement, etc.)",
              ),
            scopeType: z
              .enum(["personal", "branch", "global"])
              .describe("Scope of analytic: personal, branch, global."),
            scopeId: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "ID of the user (for personal), branch, or null for global.",
              ),
            timeRange: z
              .object()
              .describe(
                "Object describing the time period of the snapshot: {from: Date, to: Date}.",
              ),
            data: z
              .object()
              .describe(
                "The snapshot data object: may include counts, aggregates, stats specific to snapshotType and scope.",
              ),
            generatedBy: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "Identifier for subsystem or user who initiated/ran this snapshot (e.g., 'system', 'adminId', 'autoCron').",
              ),
            note: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Optional note/annotation about the analytic snapshot or calculation.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Precomputed snapshot entry for analytic dashboards, supporting personal/branch/global scope and flexible analytic/report types.",
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
      analyticSnapshotId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that will be updated",
        ),

      snapshotType: z
        .string()
        .max(255)
        .optional()
        .describe(
          "Type of analytic metric (borrowing, trend, compliance, systemLoad, engagement, etc.)",
        ),

      scopeType: z
        .enum([])
        .optional()
        .describe("Scope of analytic: personal, branch, global."),

      scopeId: z
        .string()
        .max(255)
        .optional()
        .describe("ID of the user (for personal), branch, or null for global."),

      timeRange: z
        .object({})
        .optional()
        .describe(
          "Object describing the time period of the snapshot: {from: Date, to: Date}.",
        ),

      data: z
        .object({})
        .optional()
        .describe(
          "The snapshot data object: may include counts, aggregates, stats specific to snapshotType and scope.",
        ),

      generatedBy: z
        .string()
        .max(255)
        .optional()
        .describe(
          "Identifier for subsystem or user who initiated/ran this snapshot (e.g., 'system', 'adminId', 'autoCron').",
        ),

      note: z
        .string()
        .optional()
        .describe(
          "Optional note/annotation about the analytic snapshot or calculation.",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "updateAnalyticSnapshot",
    description:
      "Update an analytic snapshot entry for correction, annotation, or snapshot refresh.",
    parameters: UpdateAnalyticSnapshotMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const updateAnalyticSnapshotMcpController =
        new UpdateAnalyticSnapshotMcpController(mcpParams);
      try {
        const result =
          await updateAnalyticSnapshotMcpController.processRequest();
        //return UpdateAnalyticSnapshotMcpController.getOutputSchema().parse(result);
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
