const sectionFortySix = {
  validate: 'required',
  component: 'govukRadios',
  name: 'section_forty_six',
  fieldset: {
    legend: {
      text: 'fields::section_forty_six.label',
      classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
    },
  },
  hint: {
    text: 'fields::section_forty_six.hint',
  },
  items: [
    {
      value: 'true',
      text: 'Yes',
    },
    {
      value: 'false',
      text: 'No',
    },
  ],
}

module.exports = sectionFortySix
