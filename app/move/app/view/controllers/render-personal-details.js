const presenters = require('../../../../../common/presenters')

function renderPersonalDetails(req, res) {
  const { move } = req
  const personalDetailsSummary = presenters.personToSummaryListComponent(
    move.profile?.person
  )

  const locals = {
    personalDetailsSummary,
  }

  res
    .breadcrumb({
      text: req.t('moves::tabs.assessments'),
      href: `${req.baseUrl}/assessments`,
    })
    .breadcrumb({ text: 'Personal details' })
    .render('move/app/view/views/personal-details', locals)
}

module.exports = renderPersonalDetails
