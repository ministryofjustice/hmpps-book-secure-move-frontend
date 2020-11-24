const { cloneDeep } = require('lodash')

module.exports = function transformResource(transformer) {
  return function deserializer(item, included) {
    const _this = cloneDeep(this)
    const modelName = this.pluralize.singular(item.type)

    // Ensure we remove this deserializer to avoid infinite loop
    delete _this.models[modelName].options.deserializer

    // call devour deserializer
    const deserializedData = _this.deserialize.resource.call(
      _this,
      item,
      included
    )

    if (!transformer) {
      return deserializedData
    }

    const transformedData = transformer(deserializedData)

    // we need to clear the cache to avoid the original resource being loaded
    // the cache is a collection and doesn't allow an item to be updated
    this.deserialize.cache.clear()
    // set the new transformed data to the cache for future deserializations
    this.deserialize.cache.set(item.type, item.id, transformedData)

    return transformedData
  }
}
