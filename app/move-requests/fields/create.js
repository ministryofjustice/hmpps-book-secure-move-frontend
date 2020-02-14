module.exports = {
  prison_number: {
    component: 'govukInput',
    label: {
      html: 'fields::prison_number.label',
      classes: 'govuk-label--s',
    },
    id: 'prison_number',
    name: 'prison_number',
    classes: 'govuk-input--width-20',
    autocomplete: 'off',
    validate: 'required',
  },
  prison_number_search_results: {
    component: 'govukRadios',
    multiple: true,
    items: [],
    name: 'prison_number_search_results',
    fieldset: {
      legend: {
        text: 'fields::prison_number_search_results.label',
        classes: 'govuk-fieldset__legend--s',
      },
    },
  },
}
