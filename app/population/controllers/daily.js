const populationToGrid = require('../../../common/presenters/population-to-grid')

async function daily(req, res) {
  const {
    population,
    transfers,
    params: { date, locationId },
  } = req
  const spaces = populationToGrid({ population })

  res.render('population/views/daily', {
    date: date,
    locationId: locationId,
    spaces,
    transfers,
  })
}

module.exports = daily
