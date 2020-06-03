const shouldSaveCourtHearings = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-fieldset__legend--m',
      text: 'fields::should_save_court_hearings.label',
    },
  },
  items: [
    {
      id: 'should_save_court_hearings',
      text: 'fields::should_save_court_hearings.items.yes.label',
      value: 'true',
    },
    {
      text: 'fields::should_save_court_hearings.items.no.label',
      value: 'false',
    },
  ],
  name: 'should_save_court_hearings',
  validate: 'required',
}

module.exports = shouldSaveCourtHearings
