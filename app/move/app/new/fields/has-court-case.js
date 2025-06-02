const hasCourtCase = {
  validate: 'required',
  component: 'govukRadios',
  id: 'has_court_case',
  name: 'has_court_case',
  fieldset: {
    legend: {
      text: 'fields::has_court_case.label',
      classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      id: 'has_court_case',
      value: 'true',
      text: 'fields::has_court_case.items.yes.label',
      conditional: [
        'court_hearing__court_case',
        'court_hearing__start_time',
        'court_hearing__comments',
      ],
    },
    {
      value: 'false',
      text: 'fields::has_court_case.items.no.label',
      hint: {
        text: 'fields::has_court_case.items.no.hint',
      },
    },
  ],
}

module.exports = hasCourtCase
