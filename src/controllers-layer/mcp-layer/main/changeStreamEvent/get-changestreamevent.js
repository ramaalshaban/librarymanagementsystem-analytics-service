const { GetChangeStreamEventManager } = require("managers");
const { z } = require("zod");

const AnalyticsMcpController = require("../../AnalyticsServiceMcpController");

class GetChangeStreamEventMcpController extends AnalyticsMcpController {
  constructor(params) {
    super("getChangeStreamEvent", "getchangestreamevent", params);
    this.dataName = "changeStreamEvent";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetChangeStreamEventManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        changeStreamEvent: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            streamName: z
              .string()
              .max(255)
              .describe(
                "Name/type of the subscribed change stream (e.g. analytics, lending-loan, catalog-book, etc).",
              ),
            payload: z
              .object()
              .describe(
                "Full MongoDB change event data as received (raw payload for dev/test/visualization).",
              ),
            sourceObject: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "Object/source collection which triggered the event (auditLog, loan, review, etc.).",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Entry storing a MongoDB Change Stream event for real-time dashboards as a test log and reference (not for production, but development/test/visualization).",
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
      changeStreamEventId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that is queried",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "getChangeStreamEvent",
    description: "Retrieve a change stream event log entry by id.",
    parameters: GetChangeStreamEventMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getChangeStreamEventMcpController =
        new GetChangeStreamEventMcpController(mcpParams);
      try {
        const result = await getChangeStreamEventMcpController.processRequest();
        //return GetChangeStreamEventMcpController.getOutputSchema().parse(result);
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
