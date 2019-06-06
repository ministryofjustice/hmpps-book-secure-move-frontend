
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
    items: [
      {
        text: 'Male',
      },
      {
        text: 'Female',
      },
      {
        text: 'Trans',
      },
    ],
  },
  ethnicity: {
    component: 'govukInput',
    label: {
      text: 'Ethnicity',
      classes: 'govuk-label--s',
    },
    id: 'ethnicity',
    name: 'ethnicity',
    classes: 'govuk-input--width-20',
    autocomplete: 'off',
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
        text: 'Court',
      },
      {
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
    fieldset: {
      legend: {
        text: 'Add risks',
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: 'Select all that apply',
    },
    name: 'risk',
    items: [
      {
        text: 'Violence',
        hint: {
          text: 'For example, past behaviour or current charges',
        },
      },
      {
        text: 'Escape',
      },
      {
        text: 'Must be held separately',
        hint: {
          text: 'For example, vulnerable or threatening to others',
        },
      },
      {
        text: 'Self harm',
        hint: {
          text: 'For example, suicidal or a history of self-harm',
        },
      },
      {
        text: 'Concealed items',
      },
      {
        text: 'Any other risks',
        hint: {
          text: 'Do not include health risks, you will be asked about these next',
        },
      },
    ],
  },
  // health information
  health: {
    component: 'govukCheckboxes',
    fieldset: {
      legend: {
        text: 'Add health information',
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: 'Select all that apply',
    },
    name: 'health',
    items: [
      {
        text: 'Special diet or allergy',
      },
      {
        text: 'Health issue',
      },
      {
        text: 'Medication',
      },
      {
        text: 'Wheelchair user',
      },
      {
        text: 'Pregnant',
      },
      {
        text: 'Issues with speech',
      },
      {
        text: 'Any other health information',
        hint: {
          text: 'For example, broken bones, claustrophobia',
        },
      },
    ],
  },
  // court information
  court: {
    component: 'govukCheckboxes',
    fieldset: {
      legend: {
        text: 'Add court information',
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: 'Select all that apply',
    },
    name: 'court',
    items: [
      {
        text: 'Solicitor or other legal representation',
      },
      {
        text: 'Sign or other language interpreter',
      },
      {
        text: 'Any other information',
      },
    ],
  },
}
