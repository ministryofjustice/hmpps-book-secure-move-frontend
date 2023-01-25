import { cloneDeep } from 'lodash'

export function transformResource(transformer?: (data: any) => void) {
  return function deserializer(this: any, item: any, included: string[]) {
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
