const { format, parseISO } = require('date-fns')

const { DATE_FORMATS } = require('../../../config/index')

function setBreadcrumb(req, res, next) {
  const { date, locationName } = req

  res.breadcrumb({
    text: 'Population Overview',
    href: `/population/week/${date}`,
  })

  res.breadcrumb({
    text: locationName,
    href: '',
  })

  res.breadcrumb({
    text: format(parseISO(req.date), DATE_FORMATS.WITH_DAY),
    href: req.population ? req.baseUrl : '',
  })

  next()
}

module.exports = setBreadcrumb
