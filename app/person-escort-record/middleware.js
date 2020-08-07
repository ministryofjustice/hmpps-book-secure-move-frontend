const frameworksService = require('../../common/services/frameworks')
const personEscortRecordService = require('../../common/services/person-escort-record')

function setFramework(req, res, next) {
  if (!req.personEscortRecord) {
    return next()
  }

  try {
    req.framework = frameworksService.getPersonEscortRecord(
      req.personEscortRecord?.version
    )

    next()
  } catch (error) {
    next(error)
  }
}

function setFrameworkSection(req, res, next, key) {
  const section = req.framework?.sections[key]

  if (section) {
    req.frameworkSection = section
    return next()
  }

  const error = new Error('Framework section not found')
  error.statusCode = 404

  next(error)
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
