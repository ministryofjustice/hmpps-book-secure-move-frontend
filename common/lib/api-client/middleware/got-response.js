const { isArray } = require('lodash')

function needsDeserialization(method) {
  return ['GET', 'PATCH', 'POST'].includes(method.toUpperCase())
}

module.exports = {
  name: 'got-response',
  res: function (payload) {
    /*
     * Note: This has been overridden from the devour library to support the
     * use of `Got` instead of `axios` to make requests
     */
    const { jsonApi, res, req } = payload
    const { data, errors, meta, links, included } = res.body || {}

    if (isArray(res)) {
      return {
        data: res,
      }
    }

    let deserializedData = null

    if (res.status !== 204 && needsDeserialization(req.method)) {
      if (isArray(data)) {
        deserializedData = jsonApi.deserialize.collection.call(
          jsonApi,
          data,
          included
        )
      } else if (data) {
        deserializedData = jsonApi.deserialize.resource.call(
          jsonApi,
          data,
          included
        )
      }

      jsonApi.deserialize.cache.clear()
    }

    if (data && deserializedData) {
      const params = ['meta', 'links']
      params.forEach(function (param) {
        if (data[param]) {
          deserializedData[param] = data[param]
        }
      })
    }

    return { data: deserializedData, errors, meta, links }
  },
}
