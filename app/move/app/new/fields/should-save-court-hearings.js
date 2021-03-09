const shouldSaveCourtHearings = {
  validate: 'required',
  component: 'govukRadios',
  name: 'should_save_court_hearings',
  fieldset: {
    legend: {
      text: 'fields::should_save_court_hearings.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      id: 'should_save_court_hearings',
      value: 'true',
      text: 'fields::should_save_court_hearings.items.yes.label',
    },
    {
      value: 'false',
      text: 'fields::should_save_court_hearings.items.no.label',
    },
  ],
}

module.exports = shouldSaveCourtHearings
