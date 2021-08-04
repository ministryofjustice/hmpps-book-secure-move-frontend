const presenters = require('../../../common/presenters')

module.exports = (req, res) => {
  const personalDetailsSummary = presenters.personToSummaryListComponent(
    req.person
  )

  res
    .breadcrumb({ text: req.t('person::personal_details.heading') })
    .render('person/views/personal-details', {
      personalDetailsSummary,
    })
}
