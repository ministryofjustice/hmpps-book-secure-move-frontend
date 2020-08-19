module.exports = {
  component: 'govukRadios',
  idPrefix: 'age',
  name: 'age',
  classes: 'govuk-radios--small',
  fieldset: {
    legend: {
      text: 'filters::age.legend',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  defaultValue: 'default',
  items: [
    {
      value: 'default',
      text: 'filters::age.all.label',
    },
    {
      value: 'over19',
      text: 'filters::age.over19.label',
    },
    {
      value: 'under19',
      text: 'filters::age.under19.label',
    },
    {
      value: '17to19',
      text: 'filters::age.17to19.label',
    },
    {
      value: 'under17',
      text: 'filters::age.under17.label',
    },
  ],
}
