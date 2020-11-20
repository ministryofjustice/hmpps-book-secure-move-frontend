const frameworksService = require('../../../services/frameworks')

module.exports = function assessmentTransformer(data = {}) {
  if (!data.framework) {
    return data
  }

  const framework = frameworksService.getFramework({
    framework: data.framework.name,
    version: data.framework.version,
  })

  return {
    ...data,
    _framework: framework,
  }
}
