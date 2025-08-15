const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "librarymanagementsystem - analytics",
    brand: {
      name: "librarymanagementsystem",
      image: "https://mindbricks.com/favicon.ico",
      moduleName: "analytics",
      version: process.env.SERVICE_VERSION || "1.0.0",
    },
    auth: {
      url: authUrl,
      loginPath: "/login",
      logoutPath: "/logout",
      currentUserPath: "/currentuser",
      authStrategy: "external",
      initialAuth: true,
    },
    dataObjects: [
      {
        name: "AnalyticSnapshot",
        description:
          "Precomputed snapshot entry for analytic dashboards, supporting personal/branch/global scope and flexible analytic/report types.",
        reference: {
          tableName: "analyticSnapshot",
          properties: [
            {
              name: "snapshotType",
              type: "String",
            },

            {
              name: "scopeType",
              type: "Enum",
            },

            {
              name: "scopeId",
              type: "String",
            },

            {
              name: "timeRange",
              type: "Object",
            },

            {
              name: "data",
              type: "Object",
            },

            {
              name: "generatedBy",
              type: "String",
            },

            {
              name: "note",
              type: "Text",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/analyticsnapshots/{analyticSnapshotId}",
            title: "getAnalyticSnapshot",
            query: [],

            parameters: [
              {
                key: "analyticSnapshotId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/analyticsnapshots",
            title: "createAnalyticSnapshot",
            query: [],

            body: {
              type: "json",
              content: {
                snapshotType: "String",
                scopeType: "Enum",
                scopeId: "String",
                timeRange: "Object",
                data: "Object",
                generatedBy: "String",
                note: "Text",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/analyticsnapshots/{analyticSnapshotId}",
            title: "updateAnalyticSnapshot",
            query: [],

            body: {
              type: "json",
              content: {
                snapshotType: "String",
                scopeType: "Enum",
                scopeId: "String",
                timeRange: "Object",
                data: "Object",
                generatedBy: "String",
                note: "Text",
              },
            },

            parameters: [
              {
                key: "analyticSnapshotId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/analyticsnapshots/{analyticSnapshotId}",
            title: "deleteAnalyticSnapshot",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "analyticSnapshotId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/analyticsnapshots",
            title: "listAnalyticSnapshots",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "AuditLog",
        description:
          "Record of a system or user action for trace/audit purposes; stores user and source object, action, and context.",
        reference: {
          tableName: "auditLog",
          properties: [
            {
              name: "actorUserId",
              type: "ID",
            },

            {
              name: "actionType",
              type: "String",
            },

            {
              name: "targetObjectType",
              type: "String",
            },

            {
              name: "targetObjectId",
              type: "String",
            },

            {
              name: "context",
              type: "Object",
            },

            {
              name: "note",
              type: "Text",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/auditlogs/{auditLogId}",
            title: "getAuditLog",
            query: [],

            parameters: [
              {
                key: "auditLogId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/auditlogs",
            title: "createAuditLog",
            query: [],

            body: {
              type: "json",
              content: {
                actorUserId: "ID",
                actionType: "String",
                targetObjectType: "String",
                targetObjectId: "String",
                context: "Object",
                note: "Text",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/auditlogs/{auditLogId}",
            title: "updateAuditLog",
            query: [],

            body: {
              type: "json",
              content: {
                actorUserId: "ID",
                actionType: "String",
                targetObjectType: "String",
                targetObjectId: "String",
                context: "Object",
                note: "Text",
              },
            },

            parameters: [
              {
                key: "auditLogId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/auditlogs/{auditLogId}",
            title: "deleteAuditLog",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "auditLogId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/auditlogs",
            title: "listAuditLogs",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "ChangeStreamEvent",
        description:
          "Entry storing a MongoDB Change Stream event for real-time dashboards as a test log and reference (not for production, but development/test/visualization).",
        reference: {
          tableName: "changeStreamEvent",
          properties: [
            {
              name: "streamName",
              type: "String",
            },

            {
              name: "payload",
              type: "Object",
            },

            {
              name: "sourceObject",
              type: "String",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/changestreamevents/{changeStreamEventId}",
            title: "getChangeStreamEvent",
            query: [],

            parameters: [
              {
                key: "changeStreamEventId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/changestreamevents",
            title: "createChangeStreamEvent",
            query: [],

            body: {
              type: "json",
              content: {
                streamName: "String",
                payload: "Object",
                sourceObject: "String",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/changestreamevents/{changeStreamEventId}",
            title: "deleteChangeStreamEvent",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "changeStreamEventId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/changestreamevents",
            title: "listChangeStreamEvents",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },
    ],
  };

  inject(app, config);
};
