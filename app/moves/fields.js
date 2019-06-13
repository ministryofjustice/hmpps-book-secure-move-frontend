const { date } = require('./formatters')

module.exports = {
  // personal details
  reference: {
    component: 'govukInput',
    label: {
      text: 'Reference number',
      classes: 'govuk-label--s',
    },
    hint: {
      text: 'Your reference for the person',
    },
    id: 'reference',
    name: 'reference',
    classes: 'govuk-input--width-20',
    autocomplete: 'off',
  },
  first_names: {
    component: 'govukInput',
    label: {
      text: 'First name(s)',
      classes: 'govuk-label--s',
    },
    id: 'first_names',
    name: 'first_names',
    classes: 'govuk-input--width-20',
    autocomplete: 'off',
  },
  last_name: {
    component: 'govukInput',
    label: {
      text: 'Last name',
      classes: 'govuk-label--s',
    },
    id: 'last_name',
    name: 'last_name',
    classes: 'govuk-input--width-20',
    autocomplete: 'off',
  },
  date_of_birth: {
    formatter: [date],
    component: 'govukInput',
    label: {
      text: 'Date of birth',
      classes: 'govuk-label--s',
    },
    id: 'date_of_birth',
    name: 'date_of_birth',
    classes: 'govuk-input--width-10',
    autocomplete: 'off',
  },
  gender: {
    component: 'govukRadios',
    fieldset: {
      legend: {
        text: 'Gender',
        classes: 'govuk-fieldset__legend--s',
      },
    },
    name: 'gender',
    items: [],
  },
  ethnicity: {
    component: 'govukSelect',
    label: {
      text: 'Ethnicity',
      classes: 'govuk-label--s',
    },
    id: 'ethnicity',
    name: 'ethnicity',
    classes: 'govuk-input--width-20',
    items: [],
  },
  // move details
  from_location: {
  },
  to_location: {
    component: 'govukRadios',
    fieldset: {
      legend: {
        text: 'Move to',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    name: 'to_location',
    items: [
      {
        value: 'court',
        text: 'Court',
      },
      {
        value: 'prison',
        text: 'Prison',
      },
    ],
  },
  date: {
    component: 'govukRadios',
    fieldset: {
      legend: {
        text: 'Date',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    name: 'date',
    items: [
      {
        text: 'Today',
      },
      {
        text: 'Tomorrow',
      },
      {
        text: 'Another date',
      },
    ],
  },
  // risk information
  risk: {
    component: 'govukCheckboxes',
    name: 'risk',
    multiple: true,
    fieldset: {
      legend: {
        text: 'Add risks',
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: 'Select all that apply',
    },
    items: [],
  },
  // health information
  health: {
    component: 'govukCheckboxes',
    name: 'health',
    multiple: true,
    fieldset: {
      legend: {
        text: 'Add health information',
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: 'Select all that apply',
    },
    items: [],
  },
  // court information
  court_information: {
    component: 'govukCheckboxes',
    name: 'court_information',
    multiple: true,
    fieldset: {
      legend: {
        text: 'Add court information',
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: 'Select all that apply',
    },
    items: [],
  },
}
