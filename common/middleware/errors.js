const contentfulService = require('../../common/services/contentful')
const logger = require('../../config/logger')
const { AUTH_BASE_URL } = require('../../config/nunjucks/globals')

async function _getMessage(error) {
  let errorLookup = 'default'
  let outage

  if (error.code === 'EBADCSRFTOKEN') {
    errorLookup = 'tampered_with'
  } else if (error.statusCode === 404) {
    errorLookup = 'not_found'
  } else if (error.statusCode === 403 || error.statusCode === 401) {
    errorLookup = 'unauthorized'
  } else if (error.statusCode === 422) {
    errorLookup = 'unprocessable_entity'
  } else {
    outage = await findOutage()

    if (outage !== null) {
      errorLookup = 'outage'
    }
  }

  return {
    heading: `errors::${errorLookup}.heading`,
    content: `errors::${errorLookup}.content`,
    end: getDateAndTime(outage?.end),
    more: `errors::${errorLookup}.more`,
    actions: `errors::${errorLookup}.actions`,
    alternative: `errors::${errorLookup}.alternative`,
    otherwise: `errors::${errorLookup}.otherwise`,
    link: AUTH_BASE_URL + '/auth',
  }
}

function getDateAndTime(date) {
  if (!date) {
    return null
  }

  return {
    date: formatDate(date),
    time: formatTime(date),
  }
}

function formatDate(date) {
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString('en-GB', dateOptions)
}

function formatTime(date) {
  const timeOptions = {
    minute: date.getMinutes() > 0 ? 'numeric' : undefined,
    hour: 'numeric',
    hour12: true,
  }

  return date
    .toLocaleTimeString('en-GB', timeOptions)
    .replace(/\s/g, '')
    .replace(/^0/, '12')
}

async function findOutage() {
  let outage

  try {
    outage = await contentfulService.getActiveOutage()
    logger.info(outage.end)
  } catch (e) {
    outage = null
  }

  return outage
}

function notFound(req, res, next) {
  const error = new Error('Not Found')
  error.statusCode = 404

  next(error)
}

function catchAll(showStackTrace = false) {
  return async function errors(error, req, res, next) {
    if (res.headersSent) {
      return next(error)
    }

    // Remove potentially sensitive data from error
    if (error.config?.data) {
      delete error.config.data
    }

    if (error.config?.headers) {
      delete error.config.headers.Authorization
    }

    const statusCode = error.statusCode || 500
    logger[statusCode < 500 ? 'info' : 'error'](error)

    if (req.xhr) {
      return res.status(statusCode).send(error.message)
    }

    const locationType =
      req?.location?.location_type ||
      res.locals?.CURRENT_LOCATION?.location_type
    const showNomisMessage = locationType === 'prison' && statusCode === 500

    res.status(statusCode).render('error', {
      error,
      statusCode,
      showStackTrace,
      showNomisMessage,
      message: await _getMessage(error),
    })
  }
}

module.exports = {
  notFound,
  catchAll,
}
