const otherCriteria = {
  id: 'other_criteria',
  name: 'other_criteria',
  skip: true,
  rows: 3,
  component: 'govukTextarea',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::other_criteria.label',
    classes: 'govuk-label--s',
  },
  dependent: {
    field: 'has_other_criteria',
    value: 'true',
  },
}

module.exports = otherCriteria
