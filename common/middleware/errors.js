const logger = require('../../config/logger')

function _getMessage(error) {
  if (error.code === 'EBADCSRFTOKEN') {
    return {
      heading: 'errors::tampered_with.heading',
      content: 'errors::tampered_with.content',
    }
  }

  if (error.statusCode === 404) {
    return {
      heading: 'errors::not_found.heading',
      content: 'errors::not_found.content',
    }
  }

  if (error.statusCode === 403 || error.statusCode === 401) {
    return {
      heading: 'errors::unauthorized.heading',
      content: 'errors::unauthorized.content',
    }
  }

  return {
    heading: 'errors::default.heading',
    content: 'errors::default.content',
  }
}

function notFound(req, res, next) {
  const error = new Error('Not Found')
  error.statusCode = 404

  next(error)
}

function catchAll(showStackTrace = false) {
  return function errors(error, req, res, next) {
    const statusCode = error.statusCode || 500

    if (res.headersSent) {
      return next(error)
    }

    logger[statusCode === 404 ? 'info' : 'error'](error)

    res.status(statusCode).render('error', {
      error,
      statusCode,
      showStackTrace,
      message: _getMessage(error),
    })
  }
}

module.exports = {
  notFound,
  catchAll,
}
