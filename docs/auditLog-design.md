# Service Design Specification - Object Design for auditLog

**librarymanagementsystem-analytics-service** documentation

## Document Overview

This document outlines the object design for the `auditLog` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## auditLog Data Object

### Object Overview

**Description:** Record of a system or user action for trace/audit purposes; stores user and source object, action, and context.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **auditActorActionIdx**: [actorUserId, actionType]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `doUpdate`

The existing record will be updated with the new data.No error will be thrown.

### Properties Schema

| Property           | Type   | Required | Description                                                                                 |
| ------------------ | ------ | -------- | ------------------------------------------------------------------------------------------- |
| `actorUserId`      | ID     | No       | User (member/staff/admin) who performed the action.                                         |
| `actionType`       | String | Yes      | Type/classification of action (create, update, delete, login, search, checkout, etc.)       |
| `targetObjectType` | String | Yes      | The primary object type affected by the action (loan, reservation, book, review, fee, etc). |
| `targetObjectId`   | String | No       | ID of the object affected by this event (loan id, book id, etc).                            |
| `context`          | Object | No       | Flexible context object with additional key/value pairs related to the action.              |
| `note`             | Text   | No       | Optional annotation explaining the action, extra for compliance/audit.                      |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Auto Update Properties

`actorUserId` `actionType` `targetObjectType` `targetObjectId` `context` `note`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Elastic Search Indexing

`actorUserId` `actionType` `targetObjectType`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`actorUserId` `actionType`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Relation Properties

`actorUserId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **actorUserId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

### Filter Properties

`actorUserId` `actionType` `targetObjectType` `targetObjectId`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **actorUserId**: ID has a filter named `actorUserId`

- **actionType**: String has a filter named `actionType`

- **targetObjectType**: String has a filter named `targetObjectType`

- **targetObjectId**: String has a filter named `targetObjectId`
