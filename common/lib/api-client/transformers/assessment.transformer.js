const { mapValues } = require('lodash')

const mapItemToSection = require('../../../helpers/frameworks/map-item-to-section')
const mapQuestionToResponse = require('../../../helpers/frameworks/map-question-to-response')
const frameworksService = require('../../../services/frameworks')

module.exports = function assessmentTransformer(data = {}) {
  const { name: frameworkName, version: frameworkVersion } =
    data.framework || {}

  if (frameworkName && frameworkVersion) {
    const framework = frameworksService.getFramework({
      framework: frameworkName,
      version: frameworkVersion,
    })

    data.responses = data.responses.map(mapQuestionToResponse(framework))

    framework.sections = mapValues(framework.sections, mapItemToSection(data))

    data._framework = framework
  }
}
