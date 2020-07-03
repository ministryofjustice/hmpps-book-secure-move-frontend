const personEscortRecordService = require('../../common/services/person-escort-record')

function setFramework(framework) {
  return (req, res, next) => {
    req.framework = framework
    next()
  }
}

function setFrameworkSection(frameworkSection) {
  return (req, res, next) => {
    req.frameworkSection = frameworkSection
    next()
  }
}

async function setPersonEscortRecord(req, res, next, recordId) {
  if (!recordId) {
    return next()
  }

  try {
    req.personEscortRecord = await personEscortRecordService.getById(recordId)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  setFramework,
  setFrameworkSection,
  setPersonEscortRecord,
}
