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

async function setPersonEscortRecord(req, res, next) {
  const recordId = req.params?.personEscortRecordId

  if (req.personEscortRecord) {
    return next()
  }

  if (!recordId) {
    const error = new Error('Person Escort Record not found')
    error.statusCode = 404
    return next(error)
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
