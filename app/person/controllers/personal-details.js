const presenters = require('../../../common/presenters')

module.exports = (req, res) => {
  const fullname = req.person._fullname
  const personalDetailsSummary = presenters.personToSummaryListComponent(
    req.person
  )
  const identityBar = {
    classes: 'sticky',
    caption: {
      text: req.t('person::page_caption'),
    },
    heading: {
      html: req.t('person::page_heading', {
        name: fullname,
      }),
    },
  }

  res
    .breadcrumb({ text: req.t('person::personal_details.heading') })
    .render('person/views/personal-details', {
      fullname,
      identityBar,
      personalDetailsSummary,
    })
}
