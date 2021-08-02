module.exports = (req, res) => {
  res
    .breadcrumb({ text: req.t('person::tabs.moves') })
    .render('person/views/moves', {
      resultsAsTable: req.resultsAsTable,
    })
}
