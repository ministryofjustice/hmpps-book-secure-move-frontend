# API client fixtures

## Naming convention

Fixtures are currently loaded into the [models test](/common/lib/api-client/models.test.js) to ensure that
they match the expected output from the model definition.

They follow the this pattern:

```
test/fixtures/api-client/{model name (snakecase)}/{devour method (camelcase)}.json
```

The one purpose of this is to ensure the models are defined correctly.

In the case of a nested model such as posting a move event:

```js
apiClient
      .one('move', moveId)
      .all('event')
      .post(eventData)
```

we need to test the model at the top level (`event`) with the corresponding top-level method (`create`).

So we add an `event.create.json` fixture and add this to the test cases

```js
...
event: [
  {
    method: 'create',
    httpMock: 'post',
    args: {},
  },
]
```
