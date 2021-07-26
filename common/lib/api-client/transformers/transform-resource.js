const { cloneDeep } = require('lodash')

module.exports = function transformResource(transformer) {
  return function deserializer(item, included) {
    try {
      const _this = cloneDeep(this)
      const modelName = _this.pluralize.singular(item.type)

      // Ensure we remove this deserializer to avoid infinite loop
      delete _this.models[modelName].options.deserializer

      // call devour deserializer
      const deserializedData = _this.deserialize.resource.call(
        _this,
        item,
        included
      )

      if (transformer) {
        transformer(deserializedData)
      }

      return deserializedData
    } catch (error) {
      this.deserialize.cache.clear()
      throw error
    }
  }
}
