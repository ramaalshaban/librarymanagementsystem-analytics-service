# Service Design Specification - Object Design for analyticSnapshot

**librarymanagementsystem-analytics-service** documentation

## Document Overview

This document outlines the object design for the `analyticSnapshot` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## analyticSnapshot Data Object

### Object Overview

**Description:** Precomputed snapshot entry for analytic dashboards, supporting personal/branch/global scope and flexible analytic/report types.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **snapshotTypeScope**: [snapshotType, scopeType, scopeId]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `doUpdate`

The existing record will be updated with the new data.No error will be thrown.

### Properties Schema

| Property       | Type   | Required | Description                                                                                                                       |
| -------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `snapshotType` | String | Yes      | Type of analytic metric (borrowing, trend, compliance, systemLoad, engagement, etc.)                                              |
| `scopeType`    | Enum   | Yes      | Scope of analytic: personal, branch, global.                                                                                      |
| `scopeId`      | String | No       | ID of the user (for personal), branch, or null for global.                                                                        |
| `timeRange`    | Object | Yes      | Object describing the time period of the snapshot: {from: Date, to: Date}.                                                        |
| `data`         | Object | Yes      | The snapshot data object: may include counts, aggregates, stats specific to snapshotType and scope.                               |
| `generatedBy`  | String | No       | Identifier for subsystem or user who initiated/ran this snapshot (e.g., &#39;system&#39;, &#39;adminId&#39;, &#39;autoCron&#39;). |
| `note`         | Text   | No       | Optional note/annotation about the analytic snapshot or calculation.                                                              |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Auto Update Properties

`snapshotType` `scopeType` `scopeId` `timeRange` `data` `generatedBy` `note`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **scopeType**: [personal, branch, global]

### Elastic Search Indexing

`snapshotType` `scopeType` `scopeId`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`snapshotType` `scopeType` `scopeId`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Filter Properties

`snapshotType` `scopeType` `scopeId` `timeRange` `generatedBy`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **snapshotType**: String has a filter named `snapshotType`

- **scopeType**: Enum has a filter named `scopeType`

- **scopeId**: String has a filter named `scopeId`

- **timeRange**: Object has a filter named `timeRange`

- **generatedBy**: String has a filter named `generatedBy`
