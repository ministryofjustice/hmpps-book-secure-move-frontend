const {
  isCurrentWeek,
  isPreviousWeek,
  isNextWeek,
} = require('../../../common/helpers/date')
const {
  formatDateWithRelativeDay,
} = require('../../../config/nunjucks/filters')

function setBreadcrumb(req, res, next) {
  const { date, locationName } = req

  let dateSuffix = ''

  if (isCurrentWeek(date)) {
    dateSuffix = ` (${req.t('actions::current_week')})`
  } else if (isNextWeek(date)) {
    dateSuffix = ` (${req.t('actions::next_week')})`
  } else if (isPreviousWeek(date)) {
    dateSuffix = ` (${req.t('actions::previous_week')})`
  }

  res
    .breadcrumb({
      text: `${req.t('population::breadcrumbs.home')}${dateSuffix}`,
      href: `/population/week/${date}`,
    })
    .breadcrumb({
      text: locationName,
      href: '',
    })
    .breadcrumb({
      text: formatDateWithRelativeDay(req.date),
      href: req.baseUrl,
    })

  next()
}

module.exports = setBreadcrumb
