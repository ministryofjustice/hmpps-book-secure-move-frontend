# API client

The internal API client is based on top of the [JSON:API devour client](https://github.com/twg/devour).

This module exports a singleton to avoid creating a new devour instance with each use.

## Middleware

This library uses [middleware modules](./middleware) to take care of things like authentication and data
transformation in a single layer.

## Models

[Models](./models) are defined as objects that are passed to the `devour.define`  method. The take the following form:

```javascript
module.exports = {
  fields: {
    // defines model attributes and relationships
    // passed to `define` as second argument
    ...
  },
  options: {
    // defines devour options and custom application options used within middleware
    // passed to `define` as third argument
    ...
  }
}
```

### Custom options

The following custom options have been created to be used within middleware.

- `cache` - set to `true` to cache responses for this resource endpoint

## Data transformation

Devour doesn't support an easy way to transform the data once it has been deserialized.

A [helper function](./transformers/transform-resource.js) has been created so that a transform method can be passed to it when
using the `deserializer` option on a model.

This transform method **should mutate** the data passed to it rather than return a new
object to avoid issues with devour cache.

### Naming convention

To avoid conflicts with API attributes or relationships (old and potentially new) custom
properties that are added in the transformation layer should contain an underscore (`_`)
prefix. For example:

```javascript
// model
const { transformResource, exampleTransformer } = require('../transformers')

module.exports = {
  fields: {
    foo: '',
  },
  options: {
    deserializer: transformResource(exampleTransformer),
  }
}

// transformer
module.exports = function exampleTransformer(data) {
  data._fizz = 'buzz'
}
```
