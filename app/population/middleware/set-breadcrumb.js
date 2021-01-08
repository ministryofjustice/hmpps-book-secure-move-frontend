const { isThisWeek, parseISO, startOfWeek, format } = require('date-fns')

const {
  formatDateRangeAsRelativeWeek,
  formatDate,
} = require('../../../config/nunjucks/filters')

function setBreadcrumb(req, res, next) {
  const {
    date,
    locationName,
    locationId,
    params: { period },
  } = req

  const weekOptions = {
    weekStartsOn: 1,
  }

  let dateSuffix

  const dateAsStartOfWeekDate = startOfWeek(parseISO(date), weekOptions)

  if (isThisWeek(parseISO(date), weekOptions)) {
    dateSuffix = ` (${formatDateRangeAsRelativeWeek([
      dateAsStartOfWeekDate,
      dateAsStartOfWeekDate,
    ])})`
  } else {
    dateSuffix = ` (${formatDate(dateAsStartOfWeekDate)})`
  }

  const basePath = `/population/week/${format(
    dateAsStartOfWeekDate,
    'yyyy-MM-dd'
  )}`

  res
    .breadcrumb({
      text: `${req.t('population::breadcrumbs.home')}${dateSuffix}`,
      href: basePath,
    })
    .breadcrumb({
      text: locationName,
      href: `${basePath}/${locationId}`,
    })

  if (period === 'day') {
    res.breadcrumb({
      text: format(parseISO(req.date), 'EEEE d MMMM'),
      href: req.baseUrl,
    })
  }

  next()
}

module.exports = setBreadcrumb
