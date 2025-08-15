# Service Design Specification - Object Design for changeStreamEvent

**librarymanagementsystem-analytics-service** documentation

## Document Overview

This document outlines the object design for the `changeStreamEvent` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## changeStreamEvent Data Object

### Object Overview

**Description:** Entry storing a MongoDB Change Stream event for real-time dashboards as a test log and reference (not for production, but development/test/visualization).

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Properties Schema

| Property       | Type   | Required | Description                                                                                  |
| -------------- | ------ | -------- | -------------------------------------------------------------------------------------------- |
| `streamName`   | String | Yes      | Name/type of the subscribed change stream (e.g. analytics, lending-loan, catalog-book, etc). |
| `payload`      | Object | Yes      | Full MongoDB change event data as received (raw payload for dev/test/visualization).         |
| `sourceObject` | String | No       | Object/source collection which triggered the event (auditLog, loan, review, etc.).           |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Constant Properties

`payload` `sourceObject`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`streamName`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Filter Properties

`streamName` `sourceObject`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **streamName**: String has a filter named `streamName`

- **sourceObject**: String has a filter named `sourceObject`
