const { get } = require('lodash')

const logger = require('../../config/logger')

function _getMessage(error) {
  let errorLookup = 'default'

  if (error.code === 'EBADCSRFTOKEN') {
    errorLookup = 'tampered_with'
  } else if (error.statusCode === 404) {
    errorLookup = 'not_found'
  } else if (error.statusCode === 403 || error.statusCode === 401) {
    errorLookup = 'unauthorized'
  } else if (error.statusCode === 422) {
    errorLookup = 'unprocessable_entity'
  }

  return {
    heading: `errors::${errorLookup}.heading`,
    content: `errors::${errorLookup}.content`,
  }
}

function notFound(req, res, next) {
  const error = new Error('Not Found')
  error.statusCode = 404

  next(error)
}

function catchAll(showStackTrace = false) {
  return function errors(error, req, res, next) {
    if (res.headersSent) {
      return next(error)
    }

    const statusCode = error.statusCode || 500
    logger[statusCode < 500 ? 'info' : 'error'](error)

    if (req.xhr) {
      return res.status(statusCode).send(error.message)
    }

    const locationType = get(res.locals, 'CURRENT_LOCATION.location_type')
    const showNomisMessage = locationType === 'prison' && statusCode === 500

    res.status(statusCode).render('error', {
      error,
      statusCode,
      showStackTrace,
      showNomisMessage,
      message: _getMessage(error),
    })
  }
}

module.exports = {
  notFound,
  catchAll,
}
