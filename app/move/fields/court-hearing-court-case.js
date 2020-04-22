const courtHearingCourtCase = {
  name: 'court_hearing__court_case',
  validate: 'required',
  component: 'govukRadios',
  items: [],
  skip: true,
  fieldset: {
    legend: {
      text: 'fields::court_hearing__court_case.label',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  hint: {
    text: 'fields::court_hearing__court_case.hint',
  },
  dependent: {
    field: 'has_court_case',
    value: 'true',
  },
}

module.exports = courtHearingCourtCase
