const frameworksService = require('../../services/frameworks')

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

module.exports = setFramework
