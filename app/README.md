# App modules

App modules are subsections of the main site, dealing with a specific area , e.g locations or moves. They are constructed using [Express](https://expressjs.com) [routers](https://expressjs.com/en/api.html#router), [param middleware](https://expressjs.com/en/api.html#router.param) and [shared middleware](https://expressjs.com/en/api.html#router.use).

They can have a variety of different parts, in either a root file, or a folder with multiple files, and exposed via an `index.ts` in the folder.

- `controllers` - Express controllers
- `constants` - Predefined default settings for a module, including routing paths, actions, and other defaults
- `fields` - Form-wizard field definitions
- `middleware` - Express middleware for the module, rendering against the views
- `steps` - Form-wizard step definitions
- `validators` - Form-wizard field validator functions
- `views` - Nunjucks templates
- `index / routing` - Main entrypoint for the module, tying together all the parts of the module in the form of an Express router

## Form Wizard

Note: Multi-page forms are provided using the [HMPO Form Wizard](https://github.com/HMPO/hmpo-form-wizard) and have a different setup and lifecycle. Please refer to the linked documentation for more information and not the app module specific details below.

## Routing

The index file of each app module is used to setup any routes or subroutes that this module will serve through Express. The [standard Express middleware pattern](https://expressjs.com/en/guide/using-middleware.html) is used here with a variety of middleware using and transforming the request object, with a final method that will usually render content.

## Middleware

There are a variety of generic middleware that are provided from within the [common](../common/middleware) folder

## Common Middleware

- `permissions` - secures route access based upon user permissions
- `setLocations` - sets locations on the current request
- `setPrimaryNaviation` - sets the primaryNavigation based upon the current users permissions
- `setUser` - sets the user on the current request from the session

### Common Collections Middleware

- `redirectDefaultQuery` - redirect with a default query if provided
- `redirectView` - redirect to a path of the format `timePeriod/date/location/view?query`
- `setActions` - sets potential actions during the routing setup phase
- `setContext` - sets the `context` used by [i18next](https://www.i18next.com/translation-function/context) to specific content within a generalised template
- `setDateRange` - sets the `dateRange` used by the weekly views
- `setDatePagination` - sets the pagination object used for day/week pagination. Note: This is not for numeric pagination of table data.

## Orchestration

There are also three specific kinds of orchestration middleware used by this application to more clearly orchestrate fetching and arranging of data. When multiple instances of this middleware are used, they share data through the `req.body[moduleName]` property.

- `setBody` — used to build the shared body data that is used to call service(s) which then supplies data for the filter and the results. Contains a shared query for date filters, location filters, etc. Attaches data to `req.body[moduleName]`.
- `setFilter` — builds the filter component for collection modules. Uses `req.body[moduleName]` as a base and overrides the filter based on the desired counts to retrieve - usually status. Attaches data as a filter component to `req.filter`.
- `setResults` — makes a call to the relevant service method to return the results that should be displayed for the current view. Can use `req.body[moduleName]` which is based on the current params and filters in the URL. If required for the view it will also call the relevant [presenter]('../common/presenters') for this resource type and sets the results as `req.resultsAsTable` or `req.resultsAsCards` to be used by the controller/template.

## General notes

- [Services](../common/services) are the only part of application that should have knowledge of the backend services. This means that  API specific properties, e.g. `filter[from_location]` should contained within this service and exposed in a different way, such as a paremter of `fromLocationId`. This also allows the rest of the application to maintain a consistency, while the API is changed and upgraded.
- Properties should be added to `req` as needed, and other middleware functions can use these properties as required. `res.locals` should be reserved only for data that will definitely be rendered in some way - often data on the `req` object can replace this usage.
- Filter properties are used for the filter component and not for specific filtering of service data. If non-configurable data filtering is required, this can usually be more carefully hidden behind a service convenience method.

