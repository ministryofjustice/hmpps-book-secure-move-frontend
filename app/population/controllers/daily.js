const populationToGrid = require('../../../common/presenters/population-to-grid')

async function daily(req, res) {
  const { population, transfers } = req
  const spaces = populationToGrid({ population })

  res.render('population/views/daily', {
    date: req.params.date,
    spaces,
    transfers,
  })
}

module.exports = daily
