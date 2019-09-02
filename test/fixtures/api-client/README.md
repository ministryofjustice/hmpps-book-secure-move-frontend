# API client fixtures

## Naming convention

Fixtures are currently loaded into the [models test](/common/lib/api-client/models.test.js) to ensure that
they match the expected output from the model definition.

They follow the this pattern:

```
test/fixtures/api-client/{model name (snakecase)}/{devour method (camelcase)}.json
```
