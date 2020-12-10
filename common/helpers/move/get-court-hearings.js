const { sortBy } = require('lodash')

const presenters = require('../../presenters')

function getLocals(req) {
  const { move } = req

  const courtHearings = sortBy(move.court_hearings, 'start_time').map(
    courtHearing => {
      return {
        ...courtHearing,
        summaryList: presenters.courtHearingToSummaryListComponent(
          courtHearing
        ),
      }
    }
  )

  return courtHearings
}

module.exports = getLocals
