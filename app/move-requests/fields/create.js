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
    hint: 'ields::move_to_prison_name.hint',
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
        text: 'Yes',
        conditional: 'move_request_who_agreed',
      },
      {
        value: 'no',
        text: 'No',
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
  move_request_date: {
    validate: 'required',
    component: 'govukRadios',
    name: 'move_request_date',
    fieldset: {
      legend: {
        text: 'fields::move_request_date.label',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    items: [
      {
        value: 'move_request_date_deadline',
        text: 'fields::move_request_date.items.deadline.label',
        conditional: 'move_request_date_deadline',
      },
      {
        value: 'move_request_date_range',
        text: 'fields::move_request_date.items.range.label',
        conditional: 'move_request_date_range',
      },
      {
        value: 'move_request_date_specific_date',
        text: 'fields::move_request_date.items.specific_date.label',
        conditional: 'move_request_date_specific_date',
      },
    ],
  },
  move_request_date_deadline: {
    id: 'move_request_date_deadline',
    name: 'move_request_date_deadline',
    skip: true,
    component: 'govukInput',
    classes: 'govuk-input--width-20',
    label: {
      text: 'fields::move_request_date_deadline.label',
      classes: 'govuk-label--s',
    },
  },
  move_request_date_range: {
    id: 'move_request_date_range',
    name: 'move_request_date_range',
    skip: true,
    component: 'govukInput',
    classes: 'govuk-input--width-20',
    label: {
      text: 'fields::move_request_date_range.label',
      classes: 'govuk-label--s',
    },
  },
  move_request_date_specific_date: {
    id: 'move_request_date_specific_date',
    name: 'move_request_date_specific_date',
    skip: true,
    component: 'govukInput',
    classes: 'govuk-input--width-20',
    label: {
      text: 'fields::move_request_date_specific_date.label',
      classes: 'govuk-label--s',
    },
  },
  move_request_reason: {
    validate: 'required',
    component: 'govukRadios',
    name: 'move_request_reason',
    fieldset: {
      legend: {
        text: 'fields::move_request_reason.label',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    items: [
      {
        value: 'move_request_reason_accumulated_visits',
        text: 'fields::move_request_reason.items.accumulated_visits.label',
      },
      {
        value: 'move_request_reason_compassionate',
        text: 'fields::move_request_reason.items.compassionate.label',
      },
      {
        value: 'move_request_reason_court_move',
        text: 'fields::move_request_reason.items.court_move.label',
      },
      {
        value: 'move_request_reason_other_reason',
        text: 'fields::move_request_reason.items.other_reason.label',
        conditional: 'move_request_reason_other_reason',
      },
    ],
  },
  move_request_reason_other_reason: {
    skip: true,
    validate: 'required',
    component: 'govukInput',
    label: {
      text: 'fields::move_request_reason_other_reason.label',
      classes: 'govuk-label--s',
    },
    id: 'move_request_reason_other_reason',
    name: 'move_request_reason_other_reason',
    classes: 'govuk-input--width-20',
  },
}
