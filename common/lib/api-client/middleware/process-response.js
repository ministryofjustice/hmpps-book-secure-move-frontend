const findUnpopulatedResources = require('../../find-unpopulated-resources')

const processResponseMiddleware = {
  name: 'process-response',
  req: function req(response) {
    const { req = {} } = response

    if (req.preserveResourceRefs) {
      response.data.included = response.data.included || []
      const populateOptions =
        req.preserveResourceRefs === true ? {} : req.preserveResourceRefs
      const missingIncludes = findUnpopulatedResources(
        response.data,
        populateOptions
      ).filter(
        missing =>
          !response.data.included.some(included => included.id === missing.id)
      )
      response.data.included = response.data.included.concat(missingIncludes)
    }

    return response
  },
}

module.exports = processResponseMiddleware
