const hasCourtCase = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      text: 'fields::has_court_case.label',
    },
  },
  items: [
    {
      conditional: [
        'court_hearing__court_case',
        'court_hearing__start_time',
        'court_hearing__comments',
      ],
      id: 'has_court_case',
      text: 'fields::has_court_case.items.yes.label',
      value: 'true',
    },
    {
      hint: {
        text: 'fields::has_court_case.items.no.hint',
      },
      text: 'fields::has_court_case.items.no.label',
      value: 'false',
    },
  ],
  name: 'has_court_case',
  validate: 'required',
}

module.exports = hasCourtCase
