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

function setfilterSingleRequests(customPath = '') {
  return async function buildFilter(req, res, next) {
    const promises = filterConfig.map(item =>
      singleRequestService
        .getAll({
          ...req.body,
          isAggregation: true,
          status: item.status,
        })
        .then(value => {
          return {
            ...item,
            value,
            active: item.status === req.body.status,
            href: `${req.baseUrl +
              req.path +
              customPath}?status=${item.status || ''}`,
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
}

module.exports = setfilterSingleRequests
