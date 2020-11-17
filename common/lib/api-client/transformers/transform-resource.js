const { cloneDeep } = require('lodash')

module.exports = function transformResource(transformer) {
  return function deserializer(item, included) {
    const _this = cloneDeep(this)
    const modelName = this.pluralize.singular(item.type)

    delete _this.models[modelName].options.deserializer

    const deserialized = _this.deserialize.resource.call(_this, item, included)

    if (!transformer) {
      return deserialized
    }

    return transformer(deserialized)
  }
}
