function transfers(req, res) {
  const today = new Date().toISOString()

  res.render('population/view/transfers', {
    pageTitle: 'population::transfers.title',
    today,
  })
}

module.exports = transfers
