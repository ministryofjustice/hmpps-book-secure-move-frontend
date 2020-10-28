# App modules

App modules are subsections of the main site, dealing with a specific area , e.g locations or moves. They are constructed using [Express](https://expressjs.com) [routers](https://expressjs.com/en/api.html#router), [param middleware](https://expressjs.com/en/api.html#router.param) and [shared middleware](https://expressjs.com/en/api.html#router.use).

They can have a variety of different parts, in either a root file, or a folder with multiple files, and exposed via an `index.js` in the folder.

- controllers
  - Express
- constants
  - Predefined default settings for a module, including routing paths, actions, and other defaults
- fields
  - Form-wizard field definitions
- middleware
  - Express middleware for the module, rendering against the views
- steps
  - Form-wizard step definitions
- validators
  - Form-wizard field validator functions
- views
  - Nunjucks templates
- index (routing)
  - Main entrypoint for the module, tying together all the parts of the module in the form of an Express router

## Index / Routing Setup

### params middleware

- set req vars
  - **setDateRange**
    - req.period
    - req.dateRange
- redirect

### shared middleware

- **saveUrl**

### routing middleware

#### types

- redirects
- simple routes
- routes with form-wizard
- sub-routers
- arrays of grouped middleware
  - collections middleware (`setActions`,`setContext`,`setPagination`)
  - data setup, retrieval and transformation middleware (`setBody` `setFilter` `setResults`)

#### router.`HTTP_METHOD`

##### Generic middleware

- **path/with/:tokens**
- **protectRoute**
- redirects

##### Collections setup

- setActions
- setContext
  - permission
  - text
  - href
- setPagination

##### Data setup, retrieval and transformation

- setBody\<<Something\>>
  - sets `req.body.<<something>>`
    - structure includes `status`, `sortBy`, `sortDirection`, `[locationType]`
  - example:
    - set-body-allocations
      - uses
        - req.query
          - status
          - sortboy
          - sortDirection
        - req.params.dateRange
        - req.lcations
      - sets
        - status
        - sortBy
        - sortDirection
        - moveDate
        - \[locationType\]
  - set-body-moves
    - uses
      - req.params.dateRange
      - req.locations
      - req.session.user.supplierId
    - sets
      - req.body
        - dateRange
        - locationProperty
        supplierId
  - set-body-single-requests
    - uses
      - req.query
        - status
        - sortBy
        - sortDirection
      - req.params.dateRage
      - req.locations
    - req.body.requested
      - status
      - sortBy
      - sortDirection
      - \[dateType\]
      - dateRange
      - fromLocationId
      
      
      
        
- set\<<Something\>>\*Filters
  - calls services
  - uses body prop
  - sets `req.filter`
- set\<<Something\>>Results
  - calls services
  - uses body prop
  - sets `req.results<<Something>>` or `req.resultsSomethingAsTable`
  - example
    - setResultsMoves
      - uses
        - req.bod.\<<bodyKey\>>
        - req.session.currentLocation
      - calls
         - movesService.getActive
         - movesService.getCancelled
         
- setFilter\<<Something\>>
  - calls services
  - sets `req.filter` and or `req.filter<<Something>>`
  - example:
    - setFilterAllocations
      - uses
        - req.body.allocations
        - req.query
        - req.baseUrl
        - req.path
      - calls
        - allocationService.getActive
      - sets
        - req
          - filter
          - filterAllocations   
    - setFilterMoves
      - uses
        - req.body.\<<bodyKey\>>
        - req.session.user.supplierId
        - req.baseUrl
        - req.path
      - calls
        - moveService
      - sets
        - req.filter
        - req.filter\<<bodyKey\>>
          
###### Example

- allocations
  setBodyAllocations,
  setResultsAllocations,
  setFilterAllocations(FILTERS.outgoing),

##### Render

- `render` method from controller, e.g. `home/controllers.js:dashboard`
  - `res.render` with template e.g. `home/dashboard`
    - actions
    - context
    - dateRange
    - filter
    - pagination
    - period
    - resultsVars

# Questions

- what is the difference between setBody, setFilter and setResults
- what is context? It's used by Express and by Nunjucks, are they exactly the same thing?
- ````javascript
  content: {
          html: t("collections::no_results", {
            context: context
          })
        }```
          - ```javascript
      {{ t("errors::" + errorKey + ".content", { context: journeyName }) | safe }}
      ```
  ````
