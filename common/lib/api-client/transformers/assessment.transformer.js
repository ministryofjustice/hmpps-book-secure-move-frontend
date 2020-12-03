const { mapValues } = require('lodash')

const mapItemToSection = require('../../../helpers/frameworks/map-item-to-section')
const mapQuestionToResponse = require('../../../helpers/frameworks/map-question-to-response')
const frameworksService = require('../../../services/frameworks')

module.exports = function assessmentTransformer(data = {}) {
  if (data.framework) {
    const framework = frameworksService.getFramework({
      framework: data.framework.name,
      version: data.framework.version,
    })

    data.responses = data.responses.map(mapQuestionToResponse(framework))

    framework.sections = mapValues(framework.sections, mapItemToSection(data))

    data._framework = framework
  }
}
