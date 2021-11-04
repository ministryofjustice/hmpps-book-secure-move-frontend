module.exports = (req, res) => {
  res.render('person/views/moves', {
    resultsAsTable: req.resultsAsTable,
    moveId: req.query?.move,
  })
}
