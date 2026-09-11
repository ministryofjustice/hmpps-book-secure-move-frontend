const { find, get } = require('lodash')

const dateHelpers = require('../../common/helpers/date')
const { setSelectedLocation } = require('../locations/middleware')
const { MOUNTPATH: MOVES_MOUNTPATH } = require('../moves/constants')

function accessError(agency) {
  const error = new Error(
    `CSRA link could not resolve an accessible location for agency '${agency}'`
  )
  error.statusCode = 403
  error.cause = 'CSRA_LOCATION_INACCESSIBLE'
  return error
}

async function redirectToIncomingMoves(req, res, next) {
  const { agency } = req.query

  let location

  try {
    location = agency
      ? await req.services.referenceData.getLocationByNomisAgencyId(agency)
      : null
  } catch (error) {
    return next(error)
  }

  const userLocations = get(req.session, 'user.locations', [])
  const permittedLocation =
    location && find(userLocations, { id: location.id })

  // eslint-disable-next-line no-console
  console.log('[csra debug]', {
    agency,
    location,
    userLocations,
  })

  if (!permittedLocation) {
    return next(accessError(agency))
  }

  setSelectedLocation(req, 'currentLocation', permittedLocation)
  req.session.hasSelectedLocation = true

  const [today] = dateHelpers.getCurrentDayAsRange()

  res.redirect(`${MOVES_MOUNTPATH}/day/${today}/incoming`)
}

module.exports = {
  redirectToIncomingMoves,
}
