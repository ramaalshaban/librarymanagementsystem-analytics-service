# REST API GUIDE

## librarymanagementsystem-analytics-service

Produces personal, branch, and admin analytic dashboards; leverages MongoDB aggregation &amp; change streams for real-time and historical analytics; generates usage, trend, and audit reports; stores audit trails; presents localized, personalized, and global analytics; supports compliance.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to .
For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

## Documentation Scope

Welcome to the official documentation for the Analytics Service's REST API. This document is designed to provide a comprehensive guide to interfacing with our Analytics Service exclusively through RESTful API endpoints.

**Intended Audience**

This documentation is intended for developers and integrators who are looking to interact with the Analytics Service via HTTP requests for purposes such as creating, updating, deleting and querying Analytics objects.

**Overview**

Within these pages, you will find detailed information on how to effectively utilize the REST API, including authentication methods, request and response formats, endpoint descriptions, and examples of common use cases.

Beyond REST
It's important to note that the Analytics Service also supports alternative methods of interaction, such as gRPC and messaging via a Message Broker. These communication methods are beyond the scope of this document. For information regarding these protocols, please refer to their respective documentation.

## Authentication And Authorization

To ensure secure access to the Analytics service's protected endpoints, a project-wide access token is required. This token serves as the primary method for authenticating requests to our service. However, it's important to note that access control varies across different routes:

**Protected Routes**:
Certain routes require specific authorization levels. Access to these routes is contingent upon the possession of a valid access token that meets the route-specific authorization criteria. Unauthorized requests to these routes will be rejected.

**Public Routes**:
The service also includes routes that are accessible without authentication. These public endpoints are designed for open access and do not require an access token.

### Token Locations

When including your access token in a request, ensure it is placed in one of the following specified locations. The service will sequentially search these locations for the token, utilizing the first one it encounters.

| Location             | Token Name / Param Name              |
| -------------------- | ------------------------------------ |
| Query                | access_token                         |
| Authorization Header | Bearer                               |
| Header               | librarymanagementsystem-access-token |
| Cookie               | librarymanagementsystem-access-token |

Please ensure the token is correctly placed in one of these locations, using the appropriate label as indicated. The service prioritizes these locations in the order listed, processing the first token it successfully identifies.

## Api Definitions

This section outlines the API endpoints available within the Analytics service. Each endpoint can receive parameters through various methods, meticulously described in the following definitions. It's important to understand the flexibility in how parameters can be included in requests to effectively interact with the Analytics service.

This service is configured to listen for HTTP requests on port `3004`,
serving both the main API interface and default administrative endpoints.

The following routes are available by default:

- **API Test Interface (API Face):** `/`
- **Swagger Documentation:** `/swagger`
- **Postman Collection Download:** `/getPostmanCollection`
- **Health Checks:** `/health` and `/admin/health`
- **Current Session Info:** `/currentuser`
- **Favicon:** `/favicon.ico`

This service is accessible via the following environment-specific URLs:

- **Preview:** `https://analytics-api-librarymanagementsystem.prw.mindbricks.com`
- **Staging:** `https://analytics-api-librarymanagementsystem.staging.mindbricks.com`
- **Production:** `https://analytics-api-librarymanagementsystem.prod.mindbricks.com`

**Parameter Inclusion Methods:**
Parameters can be incorporated into API requests in several ways, each with its designated location. Understanding these methods is crucial for correctly constructing your requests:

**Query Parameters:** Included directly in the URL's query string.

**Path Parameters:** Embedded within the URL's path.

**Body Parameters:** Sent within the JSON body of the request.

**Session Parameters:** Automatically read from the session object. This method is used for parameters that are intrinsic to the user's session, such as userId. When using an API that involves session parameters, you can omit these from your request. The service will automatically bind them to the route, provided that a session is associated with your request.

**Note on Session Parameters:**
Session parameters represent a unique method of parameter inclusion, relying on the context of the user's session. A common example of a session parameter is userId, which the service automatically associates with your request when a session exists. This feature ensures seamless integration of user-specific data without manual input for each request.

By adhering to the specified parameter inclusion methods, you can effectively utilize the Analytics service's API endpoints. For detailed information on each endpoint, including required parameters and their accepted locations, refer to the individual API definitions below.

### Common Parameters

The `Analytics` service's routes support several common parameters designed to modify and enhance the behavior of API requests. These parameters are not individually listed in the API route definitions to avoid repetition. Instead, refer to this section to understand how to leverage these common behaviors across different routes. Note that all common parameters should be included in the query part of the URL.

### Supported Common Parameters:

- **getJoins (BOOLEAN)**: Controls whether to retrieve associated objects along with the main object. By default, `getJoins` is assumed to be `true`. Set it to `false` if you prefer to receive only the main fields of an object, excluding its associations.

- **excludeCQRS (BOOLEAN)**: Applicable only when `getJoins` is `true`. By default, `excludeCQRS` is set to `false`. Enabling this parameter (`true`) omits non-local associations, which are typically more resource-intensive as they require querying external services like ElasticSearch for additional information. Use this to optimize response times and resource usage.

- **requestId (String)**: Identifies a request to enable tracking through the service's log chain. A random hex string of 32 characters is assigned by default. If you wish to use a custom `requestId`, simply include it in your query parameters.

- **caching (BOOLEAN)**: Determines the use of caching for query routes. By default, caching is enabled (`true`). To ensure the freshest data directly from the database, set this parameter to `false`, bypassing the cache.

- **cacheTTL (Integer)**: Specifies the Time-To-Live (TTL) for query caching, in seconds. This is particularly useful for adjusting the default caching duration (5 minutes) for `get list` queries. Setting a custom `cacheTTL` allows you to fine-tune the cache lifespan to meet your needs.

- **pageNumber (Integer)**: For paginated `get list` routes, this parameter selects which page of results to retrieve. The default is `1`, indicating the first page. To disable pagination and retrieve all results, set `pageNumber` to `0`.

- **pageRowCount (Integer)**: In conjunction with paginated routes, this parameter defines the number of records per page. The default value is `25`. Adjusting `pageRowCount` allows you to control the volume of data returned in a single request.

By utilizing these common parameters, you can tailor the behavior of API requests to suit your specific requirements, ensuring optimal performance and usability of the `Analytics` service.

### Error Response

If a request encounters an issue, whether due to a logical fault or a technical problem, the service responds with a standardized JSON error structure. The HTTP status code within this response indicates the nature of the error, utilizing commonly recognized codes for clarity:

- **400 Bad Request**: The request was improperly formatted or contained invalid parameters, preventing the server from processing it.
- **401 Unauthorized**: The request lacked valid authentication credentials or the credentials provided do not grant access to the requested resource.
- **404 Not Found**: The requested resource was not found on the server.
- **500 Internal Server Error**: The server encountered an unexpected condition that prevented it from fulfilling the request.

Each error response is structured to provide meaningful insight into the problem, assisting in diagnosing and resolving issues efficiently.

```js
{
  "result": "ERR",
  "status": 400,
  "message": "errMsg_organizationIdisNotAValidID",
  "errCode": 400,
  "date": "2024-03-19T12:13:54.124Z",
  "detail": "String"
}
```

### Object Structure of a Successfull Response

When the `Analytics` service processes requests successfully, it wraps the requested resource(s) within a JSON envelope. This envelope not only contains the data but also includes essential metadata, such as configuration details and pagination information, to enrich the response and provide context to the client.

**Key Characteristics of the Response Envelope:**

- **Data Presentation**: Depending on the nature of the request, the service returns either a single data object or an array of objects encapsulated within the JSON envelope.
  - **Creation and Update Routes**: These routes return the unmodified (pure) form of the data object(s), without any associations to other data objects.
  - **Delete Routes**: Even though the data is removed from the database, the last known state of the data object(s) is returned in its pure form.
  - **Get Requests**: A single data object is returned in JSON format.
  - **Get List Requests**: An array of data objects is provided, reflecting a collection of resources.

- **Data Structure and Joins**: The complexity of the data structure in the response can vary based on the route's architectural design and the join options specified in the request. The architecture might inherently limit join operations, or they might be dynamically controlled through query parameters.
  - **Pure Data Forms**: In some cases, the response mirrors the exact structure found in the primary data table, without extensions.
  - **Extended Data Forms**: Alternatively, responses might include data extended through joins with tables within the same service or aggregated from external sources, such as ElasticSearch indices related to other services.
  - **Join Varieties**: The extensions might involve one-to-one joins, resulting in single object associations, or one-to-many joins, leading to an array of objects. In certain instances, the data might even feature nested inclusions from other data objects.

**Design Considerations**: The structure of a route's response data is meticulously crafted during the service's architectural planning. This design ensures that responses adequately reflect the intended data relationships and service logic, providing clients with rich and meaningful information.

**Brief Data**: Certain routes return a condensed version of the object data, intentionally selecting only specific fields deemed useful for that request. In such instances, the route documentation will detail the properties included in the response, guiding developers on what to expect.

### API Response Structure

The API utilizes a standardized JSON envelope to encapsulate responses. This envelope is designed to consistently deliver both the requested data and essential metadata, ensuring that clients can efficiently interpret and utilize the response.

**HTTP Status Codes:**

- **200 OK**: This status code is returned for successful GET, GETLIST, UPDATE, or DELETE operations, indicating that the request has been processed successfully.
- **201 Created**: This status code is specific to CREATE operations, signifying that the requested resource has been successfully created.

**Success Response Format:**

For successful operations, the response includes a `"status": "OK"` property, signaling the successful execution of the request. The structure of a successful response is outlined below:

```json
{
  "status":"OK",
  "statusCode": 200,
  "elapsedMs":126,
  "ssoTime":120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName":"products",
  "method":"GET",
  "action":"getList",
  "appVersion":"Version",
  "rowCount":3
  "products":[{},{},{}],
  "paging": {
    "pageNumber":1,
    "pageRowCount":25,
    "totalRowCount":3,
    "pageCount":1
  },
  "filters": [],
  "uiPermissions": []
}
```

- **`products`**: In this example, this key contains the actual response content, which may be a single object or an array of objects depending on the operation performed.

**Handling Errors:**

For details on handling error scenarios and understanding the structure of error responses, please refer to the "Error Response" section provided earlier in this documentation. It outlines how error conditions are communicated, including the use of HTTP status codes and standardized JSON structures for error messages.

**Route Validation Layers:**

Route Validations may be executed in 4 different layers. The layer is a kind of time definition in the route life cycle. Note that while conditional check times are defined by layers, the fetch actions are defined by access times.

`layer1`: "The first layer of route life cycle which is just after the request parameters are validated and the request is in controller. Any script, validation or data operation in this layer can access the route parameters only. The beforeInstance data is not ready yet."

`layer2`: "The second layer of route life cycle which is just after beforeInstance data is collected before the main operation of the route and the main operation is not started yet. In this layer the collected supplementary data is accessable with the route parameters."

`layer3`: "The third layer of route life cycle which is just after the main operation of the route is completed. In this layer the main operation result is accessable with the beforeInstance data and route parameters. Note that the afterInstance data is not ready yet."

`layer4`: "The last layer of route life cycle which is just after afterInstance supplementary data is collected. In this layer the afterInstance data is accessable with the main operation result, beforeInstance data and route parameters."

## Resources

Analytics service provides the following resources which are stored in its own database as a data object. Note that a resource for an api access is a data object for the service.

### AnalyticSnapshot resource

_Resource Definition_ : Precomputed snapshot entry for analytic dashboards, supporting personal/branch/global scope and flexible analytic/report types.
_AnalyticSnapshot Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **snapshotType** | String | | | _Type of analytic metric (borrowing, trend, compliance, systemLoad, engagement, etc.)_ |
| **scopeType** | Enum | | | _Scope of analytic: personal, branch, global._ |
| **scopeId** | String | | | _ID of the user (for personal), branch, or null for global._ |
| **timeRange** | Object | | | _Object describing the time period of the snapshot: {from: Date, to: Date}._ |
| **data** | Object | | | _The snapshot data object: may include counts, aggregates, stats specific to snapshotType and scope._ |
| **generatedBy** | String | | | _Identifier for subsystem or user who initiated/ran this snapshot (e.g., &#39;system&#39;, &#39;adminId&#39;, &#39;autoCron&#39;)._ |
| **note** | Text | | | _Optional note/annotation about the analytic snapshot or calculation._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### scopeType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **personal** | `"personal""` | 0 |
| **branch** | `"branch""` | 1 |
| **global** | `"global""` | 2 |

### AuditLog resource

_Resource Definition_ : Record of a system or user action for trace/audit purposes; stores user and source object, action, and context.
_AuditLog Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **actorUserId** | ID | | | _User (member/staff/admin) who performed the action._ |
| **actionType** | String | | | _Type/classification of action (create, update, delete, login, search, checkout, etc.)_ |
| **targetObjectType** | String | | | _The primary object type affected by the action (loan, reservation, book, review, fee, etc)._ |
| **targetObjectId** | String | | | _ID of the object affected by this event (loan id, book id, etc)._ |
| **context** | Object | | | _Flexible context object with additional key/value pairs related to the action._ |
| **note** | Text | | | _Optional annotation explaining the action, extra for compliance/audit._ |

### ChangeStreamEvent resource

_Resource Definition_ : Entry storing a MongoDB Change Stream event for real-time dashboards as a test log and reference (not for production, but development/test/visualization).
_ChangeStreamEvent Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **streamName** | String | | | _Name/type of the subscribed change stream (e.g. analytics, lending-loan, catalog-book, etc)._ |
| **payload** | Object | | | _Full MongoDB change event data as received (raw payload for dev/test/visualization)._ |
| **sourceObject** | String | | | _Object/source collection which triggered the event (auditLog, loan, review, etc.)._ |

## Crud Routes

### Route: getAnalyticSnapshot

_Route Definition_ : Retrieve an analytic snapshot by id.

_Route Type_ : get

_Default access route_ : _GET_ `/analyticsnapshots/:analyticSnapshotId`

#### Parameters

The getAnalyticSnapshot api has got 1 parameter

| Parameter          | Type | Required | Population                         |
| ------------------ | ---- | -------- | ---------------------------------- |
| analyticSnapshotId | ID   | true     | request.params?.analyticSnapshotId |

To access the api you can use the **REST** controller with the path **GET /analyticsnapshots/:analyticSnapshotId**

```js
axios({
  method: "GET",
  url: `/analyticsnapshots/${analyticSnapshotId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`analyticSnapshot`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "analyticSnapshot",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "analyticSnapshot": { "id": "ID", "isActive": true }
}
```

### Route: createAnalyticSnapshot

_Route Definition_ : Create a new analytic snapshot entry.

_Route Type_ : create

_Default access route_ : _POST_ `/analyticsnapshots`

#### Parameters

The createAnalyticSnapshot api has got 7 parameters

| Parameter    | Type   | Required | Population                 |
| ------------ | ------ | -------- | -------------------------- |
| snapshotType | String | true     | request.body?.snapshotType |
| scopeType    | Enum   | true     | request.body?.scopeType    |
| scopeId      | String | false    | request.body?.scopeId      |
| timeRange    | Object | true     | request.body?.timeRange    |
| data         | Object | true     | request.body?.data         |
| generatedBy  | String | false    | request.body?.generatedBy  |
| note         | Text   | false    | request.body?.note         |

To access the api you can use the **REST** controller with the path **POST /analyticsnapshots**

```js
axios({
  method: "POST",
  url: "/analyticsnapshots",
  data: {
    snapshotType: "String",
    scopeType: "Enum",
    scopeId: "String",
    timeRange: "Object",
    data: "Object",
    generatedBy: "String",
    note: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`analyticSnapshot`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "analyticSnapshot",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "analyticSnapshot": { "id": "ID", "isActive": true }
}
```

### Route: updateAnalyticSnapshot

_Route Definition_ : Update an analytic snapshot entry for correction, annotation, or snapshot refresh.

_Route Type_ : update

_Default access route_ : _PATCH_ `/analyticsnapshots/:analyticSnapshotId`

#### Parameters

The updateAnalyticSnapshot api has got 8 parameters

| Parameter          | Type   | Required | Population                         |
| ------------------ | ------ | -------- | ---------------------------------- |
| analyticSnapshotId | ID     | true     | request.params?.analyticSnapshotId |
| snapshotType       | String | false    | request.body?.snapshotType         |
| scopeType          | Enum   | false    | request.body?.scopeType            |
| scopeId            | String | false    | request.body?.scopeId              |
| timeRange          | Object | false    | request.body?.timeRange            |
| data               | Object | false    | request.body?.data                 |
| generatedBy        | String | false    | request.body?.generatedBy          |
| note               | Text   | false    | request.body?.note                 |

To access the api you can use the **REST** controller with the path **PATCH /analyticsnapshots/:analyticSnapshotId**

```js
axios({
  method: "PATCH",
  url: `/analyticsnapshots/${analyticSnapshotId}`,
  data: {
    snapshotType: "String",
    scopeType: "Enum",
    scopeId: "String",
    timeRange: "Object",
    data: "Object",
    generatedBy: "String",
    note: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`analyticSnapshot`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "analyticSnapshot",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "analyticSnapshot": { "id": "ID", "isActive": true }
}
```

### Route: deleteAnalyticSnapshot

_Route Definition_ : Delete (soft-delete) an analytic snapshot entry.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/analyticsnapshots/:analyticSnapshotId`

#### Parameters

The deleteAnalyticSnapshot api has got 1 parameter

| Parameter          | Type | Required | Population                         |
| ------------------ | ---- | -------- | ---------------------------------- |
| analyticSnapshotId | ID   | true     | request.params?.analyticSnapshotId |

To access the api you can use the **REST** controller with the path **DELETE /analyticsnapshots/:analyticSnapshotId**

```js
axios({
  method: "DELETE",
  url: `/analyticsnapshots/${analyticSnapshotId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`analyticSnapshot`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "analyticSnapshot",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "analyticSnapshot": { "id": "ID", "isActive": false }
}
```

### Route: listAnalyticSnapshots

_Route Definition_ : List/filter all analytic snapshots (by type, scope, user, branch, range, etc).

_Route Type_ : getList

_Default access route_ : _GET_ `/analyticsnapshots`

The listAnalyticSnapshots api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /analyticsnapshots**

```js
axios({
  method: "GET",
  url: "/analyticsnapshots",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`analyticSnapshots`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "analyticSnapshots",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "analyticSnapshots": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Route: getAuditLog

_Route Definition_ : Retrieve an audit log by id.

_Route Type_ : get

_Default access route_ : _GET_ `/auditlogs/:auditLogId`

#### Parameters

The getAuditLog api has got 1 parameter

| Parameter  | Type | Required | Population                 |
| ---------- | ---- | -------- | -------------------------- |
| auditLogId | ID   | true     | request.params?.auditLogId |

To access the api you can use the **REST** controller with the path **GET /auditlogs/:auditLogId**

```js
axios({
  method: "GET",
  url: `/auditlogs/${auditLogId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`auditLog`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "auditLog",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "auditLog": { "id": "ID", "isActive": true }
}
```

### Route: createAuditLog

_Route Definition_ : Create a new audit log record for trace, compliance, and review.

_Route Type_ : create

_Default access route_ : _POST_ `/auditlogs`

#### Parameters

The createAuditLog api has got 6 parameters

| Parameter        | Type   | Required | Population                     |
| ---------------- | ------ | -------- | ------------------------------ |
| actorUserId      | ID     | false    | request.body?.actorUserId      |
| actionType       | String | true     | request.body?.actionType       |
| targetObjectType | String | true     | request.body?.targetObjectType |
| targetObjectId   | String | false    | request.body?.targetObjectId   |
| context          | Object | false    | request.body?.context          |
| note             | Text   | false    | request.body?.note             |

To access the api you can use the **REST** controller with the path **POST /auditlogs**

```js
axios({
  method: "POST",
  url: "/auditlogs",
  data: {
    actorUserId: "ID",
    actionType: "String",
    targetObjectType: "String",
    targetObjectId: "String",
    context: "Object",
    note: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`auditLog`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "auditLog",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "auditLog": { "id": "ID", "isActive": true }
}
```

### Route: updateAuditLog

_Route Definition_ : Update annotation or correction for an audit log entry.

_Route Type_ : update

_Default access route_ : _PATCH_ `/auditlogs/:auditLogId`

#### Parameters

The updateAuditLog api has got 7 parameters

| Parameter        | Type   | Required | Population                     |
| ---------------- | ------ | -------- | ------------------------------ |
| auditLogId       | ID     | true     | request.params?.auditLogId     |
| actorUserId      | ID     | false    | request.body?.actorUserId      |
| actionType       | String | false    | request.body?.actionType       |
| targetObjectType | String | false    | request.body?.targetObjectType |
| targetObjectId   | String | false    | request.body?.targetObjectId   |
| context          | Object | false    | request.body?.context          |
| note             | Text   | false    | request.body?.note             |

To access the api you can use the **REST** controller with the path **PATCH /auditlogs/:auditLogId**

```js
axios({
  method: "PATCH",
  url: `/auditlogs/${auditLogId}`,
  data: {
    actorUserId: "ID",
    actionType: "String",
    targetObjectType: "String",
    targetObjectId: "String",
    context: "Object",
    note: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`auditLog`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "auditLog",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "auditLog": { "id": "ID", "isActive": true }
}
```

### Route: deleteAuditLog

_Route Definition_ : Delete (soft) an audit log record.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/auditlogs/:auditLogId`

#### Parameters

The deleteAuditLog api has got 1 parameter

| Parameter  | Type | Required | Population                 |
| ---------- | ---- | -------- | -------------------------- |
| auditLogId | ID   | true     | request.params?.auditLogId |

To access the api you can use the **REST** controller with the path **DELETE /auditlogs/:auditLogId**

```js
axios({
  method: "DELETE",
  url: `/auditlogs/${auditLogId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`auditLog`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "auditLog",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "auditLog": { "id": "ID", "isActive": false }
}
```

### Route: listAuditLogs

_Route Definition_ : List/filter audit logs (by action, user, object, time, etc).

_Route Type_ : getList

_Default access route_ : _GET_ `/auditlogs`

The listAuditLogs api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /auditlogs**

```js
axios({
  method: "GET",
  url: "/auditlogs",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`auditLogs`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "auditLogs",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "auditLogs": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Route: getChangeStreamEvent

_Route Definition_ : Retrieve a change stream event log entry by id.

_Route Type_ : get

_Default access route_ : _GET_ `/changestreamevents/:changeStreamEventId`

#### Parameters

The getChangeStreamEvent api has got 1 parameter

| Parameter           | Type | Required | Population                          |
| ------------------- | ---- | -------- | ----------------------------------- |
| changeStreamEventId | ID   | true     | request.params?.changeStreamEventId |

To access the api you can use the **REST** controller with the path **GET /changestreamevents/:changeStreamEventId**

```js
axios({
  method: "GET",
  url: `/changestreamevents/${changeStreamEventId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`changeStreamEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "changeStreamEvent",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "changeStreamEvent": { "id": "ID", "isActive": true }
}
```

### Route: createChangeStreamEvent

_Route Definition_ : Create a new MongoDB change stream event entry (for dev/test/visualization).

_Route Type_ : create

_Default access route_ : _POST_ `/changestreamevents`

#### Parameters

The createChangeStreamEvent api has got 3 parameters

| Parameter    | Type   | Required | Population                 |
| ------------ | ------ | -------- | -------------------------- |
| streamName   | String | true     | request.body?.streamName   |
| payload      | Object | true     | request.body?.payload      |
| sourceObject | String | false    | request.body?.sourceObject |

To access the api you can use the **REST** controller with the path **POST /changestreamevents**

```js
axios({
  method: "POST",
  url: "/changestreamevents",
  data: {
    streamName: "String",
    payload: "Object",
    sourceObject: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`changeStreamEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "changeStreamEvent",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "changeStreamEvent": { "id": "ID", "isActive": true }
}
```

### Route: deleteChangeStreamEvent

_Route Definition_ : Delete (soft) a change stream event log entry.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/changestreamevents/:changeStreamEventId`

#### Parameters

The deleteChangeStreamEvent api has got 1 parameter

| Parameter           | Type | Required | Population                          |
| ------------------- | ---- | -------- | ----------------------------------- |
| changeStreamEventId | ID   | true     | request.params?.changeStreamEventId |

To access the api you can use the **REST** controller with the path **DELETE /changestreamevents/:changeStreamEventId**

```js
axios({
  method: "DELETE",
  url: `/changestreamevents/${changeStreamEventId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`changeStreamEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "changeStreamEvent",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "changeStreamEvent": { "id": "ID", "isActive": false }
}
```

### Route: listChangeStreamEvents

_Route Definition_ : List/filter change stream events, for real-time analytic monitoring (by stream, object, etc).

_Route Type_ : getList

_Default access route_ : _GET_ `/changestreamevents`

The listChangeStreamEvents api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /changestreamevents**

```js
axios({
  method: "GET",
  url: "/changestreamevents",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`changeStreamEvents`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "changeStreamEvents",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "changeStreamEvents": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Authentication Specific Routes

### Common Routes

### Route: currentuser

_Route Definition_: Retrieves the currently authenticated user's session information.

_Route Type_: sessionInfo

_Access Route_: `GET /currentuser`

#### Parameters

This route does **not** require any request parameters.

#### Behavior

- Returns the authenticated session object associated with the current access token.
- If no valid session exists, responds with a 401 Unauthorized.

```js
// Sample GET /currentuser call
axios.get("/currentuser", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**
Returns the session object, including user-related data and token information.

```
{
  "sessionId": "9cf23fa8-07d4-4e7c-80a6-ec6d6ac96bb9",
  "userId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
  "email": "user@example.com",
  "fullname": "John Doe",
  "roleId": "user",
  "tenantId": "abc123",
  "accessToken": "jwt-token-string",
  ...
}
```

**Error Response**
**401 Unauthorized:** No active session found.

```
{
  "status": "ERR",
  "message": "No login found"
}
```

**Notes**

- This route is typically used by frontend or mobile applications to fetch the current session state after login.
- The returned session includes key user identity fields, tenant information (if applicable), and the access token for further authenticated requests.
- Always ensure a valid access token is provided in the request to retrieve the session.

### Route: permissions

`*Route Definition*`: Retrieves all effective permission records assigned to the currently authenticated user.

`*Route Type*`: permissionFetch

_Access Route_: `GET /permissions`

#### Parameters

This route does **not** require any request parameters.

#### Behavior

- Fetches all active permission records (`givenPermissions` entries) associated with the current user session.
- Returns a full array of permission objects.
- Requires a valid session (`access token`) to be available.

```js
// Sample GET /permissions call
axios.get("/permissions", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**

Returns an array of permission objects.

```json
[
  {
    "id": "perm1",
    "permissionName": "adminPanel.access",
    "roleId": "admin",
    "subjectUserId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
    "subjectUserGroupId": null,
    "objectId": null,
    "canDo": true,
    "tenantCodename": "store123"
  },
  {
    "id": "perm2",
    "permissionName": "orders.manage",
    "roleId": null,
    "subjectUserId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
    "subjectUserGroupId": null,
    "objectId": null,
    "canDo": true,
    "tenantCodename": "store123"
  }
]
```

Each object reflects a single permission grant, aligned with the givenPermissions model:

- `**permissionName**`: The permission the user has.
- `**roleId**`: If the permission was granted through a role. -` **subjectUserId**`: If directly granted to the user.
- `**subjectUserGroupId**`: If granted through a group.
- `**objectId**`: If tied to a specific object (OBAC).
- `**canDo**`: True or false flag to represent if permission is active or restricted.

**Error Responses**

- **401 Unauthorized**: No active session found.

```json
{
  "status": "ERR",
  "message": "No login found"
}
```

- **500 Internal Server Error**: Unexpected error fetching permissions.

**Notes**

- The /permissions route is available across all backend services generated by Mindbricks, not just the auth service.
- Auth service: Fetches permissions freshly from the live database (givenPermissions table).
- Other services: Typically use a cached or projected view of permissions stored in a common ElasticSearch store, optimized for faster authorization checks.

> **Tip**:
> Applications can cache permission results client-side or server-side, but should occasionally refresh by calling this endpoint, especially after login or permission-changing operations.

### Route: permissions/:permissionName

_Route Definition_: Checks whether the current user has access to a specific permission, and provides a list of scoped object exceptions or inclusions.

_Route Type_: permissionScopeCheck

_Access Route_: `GET /permissions/:permissionName`

#### Parameters

| Parameter      | Type   | Required | Population                      |
| -------------- | ------ | -------- | ------------------------------- |
| permissionName | String | Yes      | `request.params.permissionName` |

#### Behavior

- Evaluates whether the current user **has access** to the given `permissionName`.
- Returns a structured object indicating:
  - Whether the permission is generally granted (`canDo`)
  - Which object IDs are explicitly included or excluded from access (`exceptions`)
- Requires a valid session (`access token`).

```js
// Sample GET /permissions/orders.manage
axios.get("/permissions/orders.manage", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**

```json
{
  "canDo": true,
  "exceptions": [
    "a1f2e3d4-xxxx-yyyy-zzzz-object1",
    "b2c3d4e5-xxxx-yyyy-zzzz-object2"
  ]
}
```

- If `canDo` is `true`, the user generally has the permission, but not for the objects listed in `exceptions` (i.e., restrictions).
- If `canDo` is `false`, the user does not have the permission by default — but only for the objects in `exceptions`, they do have permission (i.e., selective overrides).
- The exceptions array contains valid **UUID strings**, each corresponding to an object ID (typically from the data model targeted by the permission).

## Copyright

All sources, documents and other digital materials are copyright of .

## About Us

For more information please visit our website: .

.
.
