const { cloneDeep } = require('lodash')

const presenters = require('../../../common/presenters')
const moveService = require('../../../common/services/move')

const moveTypeNavigationConfig = [
  {
    label: 'moves::dashboard.filter.proposed',
    filter: 'proposed',
  },
  {
    label: 'moves::dashboard.filter.approved',
    filter: 'requested,accepted,completed',
  },
  {
    label: 'moves::dashboard.filter.rejected',
    filter: 'rejected',
  },
]

async function setMoveTypeNavigation(req, res, next) {
  const { dateRange } = res.locals
  const { locationId, period, date } = req.params
  try {
    res.locals.moveTypeNavigation = await Promise.all(
      cloneDeep(moveTypeNavigationConfig).map(moveType => {
        return moveService
          .getMovesCount({ dateRange, status: moveType.filter, locationId })
          .then(count => {
            return {
              ...moveType,
              value: count,
              active: moveType.filter === req.params.status,
              href: `${req.baseUrl}/${period}/${date}${
                locationId ? '/' + locationId : ''
              }/${moveType.filter}`,
            }
          })
      })
    ).then(moveTypes => moveTypes.map(presenters.moveTypesToFilterComponent))
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setMoveTypeNavigation
