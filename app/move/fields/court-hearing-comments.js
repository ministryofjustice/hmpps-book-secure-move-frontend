const courtHearingComments = {
  id: 'court_hearing__comments',
  name: 'court_hearing__comments',
  skip: true,
  rows: 3,
  component: 'govukTextarea',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::court_hearing__comments.label',
    classes: 'govuk-label--s',
  },
  dependent: {
    field: 'has_court_case',
    value: 'true',
  },
}

module.exports = courtHearingComments
