## Folder structure

- `app/`

  [Express](https://github.com/expressjs/express) application to preview components; also referred to as _Book a Secure Move Frontend_.

  Each folder inside this directory refers to a `module`, which can contain
  
    - `module/index.js`
       
       Route configuration for the module
       
    - `module/controllers`
    
       A file or directory of files containing MVC controllers for the module
       
    - `module/fields`

      Form wizard fields
      
    - `module/steps`
    
      Form wizard steps
 
    - `module/views`
    
      Nunjucks page templates
    - `module/validators`
    
       Form validators
       
    - `module/middleware`
    
       Middleware helpers to decorate the request with specific module data

- `artifacts/` **contains auto-generated files**

   Error reports, images and videos from testcafe runners

- `common/`

  Application code not related to routing.
  
  - `assets/`
  
     Static assets for the frontend website
     
  - `components/`
  
     App level components. [More documentation here](../common/components/README.md)

  - `controllers/`
  
     Controllers relating to specific components
     
  - `formatters/`
  
     Custom formatters
        
  - `helpers/`
  
     Various helper functions, including form and framework helpers
     
  - `lib/`
  
     Various utility functions
     
  - `middleware/`
  
     General middleware that is not specific to a route
     
  - `parsers/`
  
     Date parsing functions
     
  - `presenters/`
  
     Functions to generate UI components
         
  - `services/`
  
     Services representing the backend API
     
  - `templates/`
  
    General templates that are not specific to a module

- `config/`

  Configuration files for the app

- `coverage/` **contains auto-generated files**

   Code coverage reports

- `docs/`

  Documentation files.

- `locales/`

  i18n localisation files.

- `mocks/` 

   Contains a mock server for the auth server

- `reports` **contains auto-generated-files**

- `test/`

    - `e2e/`
    
       End to end tests
       
   - `fixtures`.
   
      Data for unit and E2E tests
   
      [More documentation here](../test/fixtures/api-client/README.md)
   
   - `unit`
  
      Helper files for the unit tests 

- `.env.example`

    Example environment file for running the server. Requires valid values. 
    
- `server.js`

   Express server as a separate module
   
- `start.js`
    
    Entrypoint for the application, using the above `server.js` module
