const { date } = require('./formatters')

const assessmentQuestionComments = {
  skip: true,
  rows: 3,
  component: 'govukTextarea',
  classes: 'govuk-input--width-20',
  label: {
    text: `fields:assessment_comment.optional`,
    classes: 'govuk-label--s',
  },
}

module.exports = {
  // personal details
  athena_reference: {
    validate: 'required',
    component: 'govukInput',
    label: {
      text: 'fields:athena_reference.label',
      classes: 'govuk-label--s',
    },
    hint: {
      text: 'fields:athena_reference.hint',
    },
    id: 'athena_reference',
    name: 'athena_reference',
    classes: 'govuk-input--width-20',
    autocomplete: 'off',
  },
  first_names: {
    validate: 'required',
    component: 'govukInput',
    label: {
      text: 'fields:first_names.label',
      classes: 'govuk-label--s',
    },
    id: 'first_names',
    name: 'first_names',
    classes: 'govuk-input--width-20',
    autocomplete: 'off',
  },
  last_name: {
    validate: 'required',
    component: 'govukInput',
    label: {
      text: 'fields:last_name.label',
      classes: 'govuk-label--s',
    },
    id: 'last_name',
    name: 'last_name',
    classes: 'govuk-input--width-20',
    autocomplete: 'off',
  },
  date_of_birth: {
    validate: ['required', 'date', 'before'],
    formatter: [date],
    component: 'govukInput',
    label: {
      text: 'fields:date_of_birth.label',
      classes: 'govuk-label--s',
    },
    id: 'date_of_birth',
    name: 'date_of_birth',
    classes: 'govuk-input--width-10',
    autocomplete: 'off',
  },
  gender: {
    validate: 'required',
    component: 'govukRadios',
    fieldset: {
      legend: {
        text: 'fields:gender.label',
        classes: 'govuk-fieldset__legend--s',
      },
    },
    name: 'gender',
    items: [],
  },
  ethnicity: {
    validate: 'required',
    component: 'govukSelect',
    label: {
      text: 'fields:ethnicity.label',
      classes: 'govuk-label--s',
    },
    id: 'ethnicity',
    name: 'ethnicity',
    classes: 'govuk-input--width-20',
    items: [],
  },
  // move details
  from_location: {},
  to_location: {},
  to_location_type: {
    validate: 'required',
    component: 'govukRadios',
    name: 'to_location_type',
    fieldset: {
      legend: {
        text: 'fields:to_location_type.label',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    items: [
      {
        id: 'to_location_type',
        value: 'court',
        text: 'fields:to_location_type.items.court.label',
        conditional: 'to_location_court',
      },
      {
        value: 'prison',
        text: 'fields:to_location_type.items.prison.label',
        conditional: 'to_location_prison',
      },
    ],
  },
  to_location_prison: {
    skip: true,
    validate: 'required',
    dependent: {
      field: 'to_location_type',
      value: 'prison',
    },
    component: 'govukSelect',
    id: 'to_location_prison',
    name: 'to_location_prison',
    classes: 'govuk-input--width-20',
    label: {
      text: 'fields:to_location_prison.label',
      classes: 'govuk-label--s',
    },
    items: [],
  },
  to_location_court: {
    skip: true,
    validate: 'required',
    dependent: {
      field: 'to_location_type',
      value: 'court',
    },
    component: 'govukSelect',
    id: 'to_location_court',
    name: 'to_location_court',
    classes: 'govuk-input--width-20',
    label: {
      text: 'fields:to_location_court.label',
      classes: 'govuk-label--s',
    },
    items: [],
  },
  date: {},
  date_type: {
    validate: 'required',
    component: 'govukRadios',
    name: 'date_type',
    fieldset: {
      legend: {
        text: 'fields:date_type.label',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    items: [
      {
        id: 'date_type',
        value: 'today',
        text: 'fields:date_type.items.today.label',
      },
      {
        value: 'tomorrow',
        text: 'fields:date_type.items.tomorrow.label',
      },
      {
        value: 'custom',
        text: 'fields:date_type.items.another.label',
        conditional: 'date_custom',
      },
    ],
  },
  date_custom: {
    skip: true,
    validate: ['required', 'date', 'after'],
    dependent: {
      field: 'date_type',
      value: 'custom',
    },
    formatter: [date],
    component: 'govukInput',
    id: 'date_custom',
    name: 'date_custom',
    label: {
      text: 'fields:date_custom.label',
      classes: 'govuk-label--s',
    },
    hint: {
      text: 'fields:date_custom.hint',
    },
    classes: 'govuk-input--width-10',
    autocomplete: 'off',
  },
  // risk information
  risk: {
    component: 'govukCheckboxes',
    name: 'risk',
    multiple: true,
    fieldset: {
      legend: {
        text: 'fields:risk.label',
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: 'fields:risk.hint',
    },
    items: [],
  },
  risk__violent: assessmentQuestionComments,
  risk__escape: assessmentQuestionComments,
  risk__hold_separately: assessmentQuestionComments,
  risk__self_harm: assessmentQuestionComments,
  risk__concealed_items: assessmentQuestionComments,
  risk__other_risks: assessmentQuestionComments,
  // health information
  health: {
    component: 'govukCheckboxes',
    name: 'health',
    multiple: true,
    fieldset: {
      legend: {
        text: 'fields:health.label',
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: 'fields:health.hint',
    },
    items: [],
  },
  health__special_diet_or_allergy: assessmentQuestionComments,
  health__health_issue: assessmentQuestionComments,
  health__medication: assessmentQuestionComments,
  health__wheelchair: assessmentQuestionComments,
  health__pregnant: assessmentQuestionComments,
  health__other_health: assessmentQuestionComments,
  // court information
  court: {
    component: 'govukCheckboxes',
    name: 'court',
    multiple: true,
    fieldset: {
      legend: {
        text: 'fields:court.label',
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: 'fields:court.hint',
    },
    items: [],
  },
  court__solicitor: assessmentQuestionComments,
  court__interpreter: assessmentQuestionComments,
  court__other_court: assessmentQuestionComments,
}
