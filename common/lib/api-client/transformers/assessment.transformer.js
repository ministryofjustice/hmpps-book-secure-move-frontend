const frameworksService = require('../../../services/frameworks')

module.exports = function assessmentTransformer(data = {}) {
  if (data.framework) {
    const framework = frameworksService.getFramework({
      framework: data.framework.name,
      version: data.framework.version,
    })

    data._framework = framework
  }
}
