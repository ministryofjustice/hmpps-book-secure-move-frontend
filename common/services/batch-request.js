const { chunk, get, set, cloneDeep } = require('lodash')

const { LOCATIONS_BATCH_SIZE } = require('../../config')

const batchRequests = async (clientMethodCall, props = {}, propPaths = []) => {
  // TODO: This is more of a temporary solution to solve the problem where
  // the API doesn't have a concept of what locations a user has access to
  //
  // Once Auth is moved to the API we would be able to remove this as the API
  // would know to only return moves that a user has access to

  for (let propIndex = 0; propIndex < propPaths.length; propIndex++) {
    const propPath = `filter["filter[${propPaths[propIndex]}]"]`
    let propPathValue = get(props, propPath)

    if (!propPathValue) {
      continue
    }

    if (!Array.isArray(propPathValue)) {
      propPathValue = propPathValue.split(',')
    }

    const { apiClient } = props

    const chunks = chunk(propPathValue, LOCATIONS_BATCH_SIZE).map(id =>
      id.join(',')
    )

    return Promise.all(
      chunks.map(chunk => {
        const batchedProps = cloneDeep(props)
        set(batchedProps, propPath, chunk)
        return clientMethodCall({ ...batchedProps, apiClient: apiClient })
      })
    ).then(response => {
      if (props.isAggregation) {
        return response.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        )
      }

      return response.flat()
    })
  }

  return clientMethodCall(props)
}

module.exports = batchRequests
