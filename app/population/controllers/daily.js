const populationToGrid = require('../../../common/presenters/population-to-grid')
const transfersToGrid = require('../../../common/presenters/transfers-to-grid')

function daily(req, res) {
  const { population } = req
  const transfers = transfersToGrid()

  const spaces = populationToGrid({ population })

  res.render('population/view/daily', {
    date: req.params.date,
    spaces,
    transfers,
  })
}

module.exports = daily
