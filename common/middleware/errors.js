const logger = require('../../config/logger')

function getStatusMessage (error) {
  if (error.code === 'EBADCSRFTOKEN') {
    return 'errors.tampered_with.heading'
  }

  if (error.statusCode === 404) {
    return 'errors.not_found.heading'
  }

  if (error.statusCode === 403 || error.statusCode === 401) {
    return 'errors.unauthorized.heading'
  }

  return 'errors.default.heading'
}

function notFound (req, res, next) {
  const error = new Error('Not Found')
  error.statusCode = 404

  next(error)
}

function catchAll (showStackTrace = false) {
  return function errors (error, req, res, next) {
    const statusCode = error.statusCode || 500

    if (res.headersSent) {
      return next(error)
    }

    logger[statusCode === 404 ? 'info' : 'error'](error)

    res
      .status(statusCode)
      .render('error', {
        error,
        statusCode,
        showStackTrace,
        statusMessage: getStatusMessage(error),
      })
  }
}

module.exports = {
  notFound,
  catchAll,
}
