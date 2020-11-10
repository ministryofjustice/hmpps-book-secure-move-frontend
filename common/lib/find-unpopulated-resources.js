const checks = require('./find-unpopulated-resources.checks')

function processArray(obj, options) {
  if (Array.isArray(obj)) {
    return obj.forEach(item => findUnpopulatedResources(item, options))
  }
}

function processObject(obj, options) {
  const { resources } = options

  if (checks.isUnpopulatedObject(obj)) {
    resources.push(obj)
  } else {
    Object.keys(obj).forEach(key => findUnpopulatedResources(obj[key], options))
  }
}

function findUnpopulatedResources(obj, options = {}) {
  const { seenResources = [], resources = [] } = options
  options.seenResources = seenResources
  options.resources = resources

  if (obj === null || seenResources.includes(obj)) {
    return
  }

  seenResources.push(obj)

  processArray(obj, options)

  if (!checks.isNonObject(obj) && !checks.isSkippableObject(obj, options)) {
    processObject(obj, options)
  }

  return resources
}

module.exports = findUnpopulatedResources
