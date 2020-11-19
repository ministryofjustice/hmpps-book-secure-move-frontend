const frameworksService = require('../../../services/frameworks')

module.exports = function personEscortRecordTransformer(data) {
  const framework = frameworksService.getPersonEscortRecord(data.version)

  return {
    ...data,
    _framework: framework,
  }
}
