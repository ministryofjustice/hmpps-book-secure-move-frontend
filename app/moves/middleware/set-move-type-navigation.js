const presenters = require('../../../common/presenters')
const singleRequestService = require('../../../common/services/single-request')

const filterConfig = [
  {
    label: 'statuses::pending',
    filter: 'pending',
  },
  {
    label: 'statuses::approved',
    filter: 'approved',
  },
  {
    label: 'statuses::rejected',
    filter: 'rejected',
  },
]

async function setMoveTypeNavigation(req, res, next) {
  const { dateRange } = res.locals
  const { locationId, period, date } = req.params
  const promises = filterConfig.map(item =>
    singleRequestService
      .getAll({
        isAggregation: true,
        createdAtDate: dateRange,
        fromLocationId: locationId,
        status: item.filter,
      })
      .then(value => {
        return {
          ...item,
          value,
          active: item.filter === req.params.status,
          href: `${req.baseUrl}/${period}/${date}${
            locationId ? `/${locationId}` : ''
          }/${item.filter}`,
        }
      })
  )

  try {
    res.locals.moveTypeNavigation = await Promise.all(promises).then(filters =>
      filters.map(presenters.moveTypesToFilterComponent)
    )

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setMoveTypeNavigation
