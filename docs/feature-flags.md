# Feature Flags

## Environment Variables

Feature flags are set using environment variables. Locally they are defined in `.env` files, on deployment environments they are defined amongst the other environmental configuration.

By convention the pattern for the environment variable is `FEATURE_FLAG_${FEATURE_NAME}`

Note: There is currently no ability to dynamically change feature flags, for example on a per-request basis. This means that tests involving them can only be applied at a unit test level, not at any level involving the browser.

## Application usage

### Configuration

These environment variables are manually linked through to the rest of the app via the `config/index.ts` file, using the following structure:

```javascript
...
FEATURE_FLAGS: {
  FEATURE_NAME:
    /true/i.test(process.env.FEATURE_FLAG_FEATURE_NAME)
}
...
```

### Routers

Code usage within the app at routing level

```javascript
const { FEATURE_FLAGS } = require('../../config')
...
router.get(
  '/subsystem/in/application',
  protectRoute('subsytem:view'),
  viewSubsystem(FEATURE_FLAGS.FEATURE_NAME)
)
```

### Controllers

Code usage within the app at controller level

```javascript
const featureNameIsEnabled =
  FEATURE_FLAGS.FEATURE_NAME && req.canAccess('feature_name:view')
```

### Other areas

It should also be possible to apply feature flags to the `next` decision of the `form-wizard` routing.

## Updating in deployment environments

Whenever an image is deployed to an environment, the most recent deploy configuration for that environment will be used. This config can also be applied manually. Please see the appropriate repo(s) for more details.

## General notes on usage

Feature flags trade an ability to quickly enable/disable functionality with increased complexity when working in areas using that functionality.

As such, once they are no longer needed they should be removed - this is usually a short time after the feature has been deemed "released" by all the appropriate stakeholders.

Also, it is helpful to avoid any unnecessary development work in the area where the feature is being work on, as this adds extra complexity in ensuring both the existing and new features continue to work as expected. Understandably, this is not always possible.
