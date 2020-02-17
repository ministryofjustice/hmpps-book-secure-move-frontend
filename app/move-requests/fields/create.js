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
    validate: 'required',
    fieldset: {
      legend: {
        text: 'fields::prison_number_search_results.label',
        classes: 'govuk-fieldset__legend--s',
      },
    },
  },
  move_to_prison_name: {
    validate: 'required',
    component: 'govukInput',
    label: {
      text: 'fields::move_to_prison_name.label',
      classes: 'govuk-label--s',
    },
    id: 'move_to_prison_name',
    name: 'move_to_prison_name',
    classes: 'govuk-input--width-20',
  },
  move_request_agreed: {
    validate: 'required',
    component: 'govukRadios',
    name: 'move_request_agreed',
    fieldset: {
      legend: {
        text: 'fields::move_request_agreed.label',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    items: [
      {
        id: 'move_request_agreed',
        value: 'yes',
        text: 'fields::move_request_agreed.items.yes.label',
        conditional: 'move_request_who_agreed',
      },
      {
        value: 'no',
        text: 'fields::move_request_agreed.items.no.label',
      },
    ],
  },
  move_request_who_agreed: {
    id: 'move_request_who_agreed',
    name: 'move_request_who_agreed',
    skip: true,
    component: 'govukInput',
    classes: 'govuk-input--width-20',
    label: {
      text: 'fields::move_request_who_agreed.label',
      classes: 'govuk-label--s',
    },
  },
}
