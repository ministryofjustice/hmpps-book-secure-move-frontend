const presenters = require('../../../common/presenters')

module.exports = (req, res) => {
  const personalDetailsSummary = presenters.personToSummaryListComponent(
    req.person
  )

  res
    .breadcrumb({ text: req.t('person::tabs.personal_details') })
    .render('person/views/personal-details', {
      personalDetailsSummary,
    })
}
