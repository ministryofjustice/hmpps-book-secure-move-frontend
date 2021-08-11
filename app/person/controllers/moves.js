module.exports = (req, res) => {
  res.render('person/views/moves', {
    resultsAsTable: req.resultsAsTable,
  })
}
