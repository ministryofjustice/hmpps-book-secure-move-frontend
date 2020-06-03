const courtHearingComments = {
  classes: 'govuk-input--width-20',
  component: 'govukTextarea',
  dependent: {
    field: 'has_court_case',
    value: 'true',
  },
  id: 'court_hearing__comments',
  label: {
    classes: 'govuk-label--s',
    text: 'fields::court_hearing__comments.label',
  },
  name: 'court_hearing__comments',
  rows: 3,
  skip: true,
}

module.exports = courtHearingComments
