const presenters = require('../../../common/presenters')
const singleRequestService = require('../../../common/services/single-request')

const filterConfig = [
  {
    label: 'statuses::pending',
    status: 'pending',
  },
  {
    label: 'statuses::approved',
    status: 'approved',
  },
  {
    label: 'statuses::rejected',
    status: 'rejected',
  },
]

async function setfilterSingleRequests(req, res, next) {
  const { dateRange } = res.locals
  const { locationId, period, date } = req.params
  const promises = filterConfig.map(item =>
    singleRequestService
      .getAll({
        isAggregation: true,
        fromLocationId: locationId,
        createdAtDate: dateRange,
        status: item.status,
      })
      .then(value => {
        return {
          ...item,
          value,
          active: item.status === req.params.status,
          href: `${req.baseUrl}/${period}/${date}${
            locationId ? `/${locationId}` : ''
          }/${item.status || ''}`,
        }
      })
  )

  try {
    req.filter = await Promise.all(promises).then(data =>
      data.map(presenters.moveTypesToFilterComponent)
    )

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setfilterSingleRequests
