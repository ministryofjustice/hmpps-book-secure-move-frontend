const otherCriteria = {
  classes: 'govuk-input--width-20',
  component: 'govukTextarea',
  dependent: {
    field: 'has_other_criteria',
    value: 'true',
  },
  id: 'other_criteria',
  label: {
    classes: 'govuk-label--s',
    text: 'fields::other_criteria.label',
  },
  name: 'other_criteria',
  rows: 3,
  skip: true,
}

module.exports = otherCriteria
