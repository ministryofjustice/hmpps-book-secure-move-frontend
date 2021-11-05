const presenters = require('../../../common/presenters')

module.exports = (req, res) => {
  const personalDetailsSummary = presenters.personToSummaryListComponent(
    req.person
  )

  res.render('person/views/personal-details', {
    personalDetailsSummary,
    moveId: req.query?.move,
  })
}
