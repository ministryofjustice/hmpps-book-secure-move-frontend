const { isThisWeek, parseISO, startOfWeek, format } = require('date-fns')

const {
  formatDateRangeAsRelativeWeek,
  formatDate,
} = require('../../../config/nunjucks/filters')

function setBreadcrumb(req, res, next) {
  const { date, locationName } = req

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

  res
    .breadcrumb({
      text: `${req.t('population::breadcrumbs.home')}${dateSuffix}`,
      href: `/population/week/${format(dateAsStartOfWeekDate, 'yyyy-MM-dd')}`,
    })
    .breadcrumb({
      text: locationName,
      href: '',
    })
    .breadcrumb({
      text: format(parseISO(req.date), 'EEEE d MMMM'),
      href: req.baseUrl,
    })

  next()
}

module.exports = setBreadcrumb
