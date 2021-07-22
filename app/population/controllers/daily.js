const populationToGrid = require('../../../common/presenters/population-to-grid')

function daily(req, res) {
  const {
    population,
    transfers,
    location: { id: locationId },
    params: { date },
  } = req
  const spaces = populationToGrid({ population })

  res.render('population/views/daily', {
    date: date,
    locationId: locationId,
    spaces,
    transfers,
    editPath: `/population/day/${date}/${locationId}/edit`,
  })
}

module.exports = daily
