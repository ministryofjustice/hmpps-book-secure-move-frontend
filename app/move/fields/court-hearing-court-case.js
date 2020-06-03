const courtHearingCourtCase = {
  component: 'govukRadios',
  dependent: {
    field: 'has_court_case',
    value: 'true',
  },
  fieldset: {
    legend: {
      classes: 'govuk-fieldset__legend--s',
      text: 'fields::court_hearing__court_case.label',
    },
  },
  hint: {
    text: 'fields::court_hearing__court_case.hint',
  },
  items: [],
  name: 'court_hearing__court_case',
  skip: true,
  validate: 'required',
}

module.exports = courtHearingCourtCase
