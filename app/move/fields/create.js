const { date } = require('../formatters')

const personSearchFilter = {
  validate: 'required',
  component: 'govukInput',
  formGroup: {
    classes: 'govuk-!-margin-bottom-2',
  },
  classes: 'govuk-input--width-10',
  autocomplete: 'off',
}

const moveType = {
  validate: 'required',
  component: 'govukRadios',
  name: 'move_type',
  fieldset: {
    legend: {
      text: 'fields::move_type.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
}

const assessmentQuestionComments = {
  skip: true,
  rows: 3,
  component: 'govukTextarea',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::assessment_comment.optional',
    classes: 'govuk-label--s',
  },
}

const requiredAssessmentQuestionComments = {
  ...assessmentQuestionComments,
  label: {
    text: 'fields::assessment_comment.required',
    classes: 'govuk-label--s',
  },
  validate: 'required',
}

function implicitAssessmentQuestions(name) {
  return {
    name,
    component: 'govukCheckboxes',
    multiple: true,
    items: [],
    fieldset: {
      legend: {
        text: `fields::${name}.label`,
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: `fields::${name}.hint`,
    },
  }
}

function toLocationType(type, props) {
  return {
    skip: true,
    dependent: {
      field: 'move_type',
      value: type,
    },
    component: 'govukSelect',
    id: `to_location_${type}`,
    name: `to_location_${type}`,
    classes: 'govuk-input--width-20',
    attributes: {
      'data-module': 'app-autocomplete',
    },
    label: {
      text: `fields::to_location_${type}.label`,
      classes: 'govuk-label--s',
    },
    items: [],
    ...props,
  }
}

function explicitAssessmentQuestion(name, value, conditional) {
  return {
    name,
    validate: 'required',
    component: 'govukRadios',
    fieldset: {
      legend: {
        text: `fields::${name}.label`,
        classes: 'govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: `fields::${name}.hint`,
    },
    items: [
      {
        value,
        conditional,
        text: 'Yes',
      },
      {
        value: 'false',
        text: 'No',
      },
    ],
  }
}

const dateField = {
  validate: ['date', 'required'],
  formatter: [date],
  component: 'govukInput',
  autocomplete: 'off',
  classes: 'govuk-input--width-10',
  hint: {
    text: 'fields::date.hint',
  },
}

module.exports = {
  // Person search
  'filter.police_national_computer': {
    ...personSearchFilter,
    id: 'filter.police_national_computer',
    name: 'filter.police_national_computer',
    label: {
      html: 'fields::filter.police_national_computer.label',
      classes: 'govuk-label--s',
    },
  },
  'filter.prison_number': {
    ...personSearchFilter,
    id: 'filter.prison_number',
    name: 'filter.prison_number',
    label: {
      html: 'fields::filter.prison_number.label',
      classes: 'govuk-label--s',
    },
  },
  people: {
    validate: 'required',
    component: 'govukRadios',
    items: [],
    name: 'people',
    formGroup: {
      classes: 'govuk-!-margin-bottom-2',
    },
    fieldset: {
      legend: {
        text: 'fields::people.label',
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: 'fields::people.hint',
    },
  },
  // personal details
  police_national_computer: {
    component: 'govukInput',
    label: {
      html: 'fields::police_national_computer.label',
      classes: 'govuk-label--s',
    },
    id: 'police_national_computer',
    name: 'police_national_computer',
    classes: 'govuk-input--width-10',
    autocomplete: 'off',
  },
  first_names: {
    validate: 'required',
    component: 'govukInput',
    label: {
      text: 'fields::first_names.label',
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
      text: 'fields::last_name.label',
      classes: 'govuk-label--s',
    },
    id: 'last_name',
    name: 'last_name',
    classes: 'govuk-input--width-20',
    autocomplete: 'off',
  },
  date_of_birth: {
    ...dateField,
    validate: [...dateField.validate, 'before'],
    label: {
      text: 'fields::date_of_birth.label',
      classes: 'govuk-label--s',
    },
    id: 'date_of_birth',
    name: 'date_of_birth',
  },
  gender: {
    validate: 'required',
    component: 'govukRadios',
    fieldset: {
      legend: {
        text: 'fields::gender.label',
        classes: 'govuk-fieldset__legend--s',
      },
    },
    name: 'gender',
    items: [],
  },
  gender_additional_information: {
    skip: true,
    component: 'govukTextarea',
    name: 'gender_additional_information',
    classes: 'govuk-input--width-20',
    rows: 3,
    label: {
      text: 'fields::gender_additional_information.label',
      classes: 'govuk-label--s govuk-input--width-20',
    },
    hint: {
      text: 'fields::gender_additional_information.hint',
      classes: 'govuk-input--width-20',
    },
  },
  ethnicity: {
    validate: 'required',
    component: 'govukSelect',
    label: {
      text: 'fields::ethnicity.label',
      classes: 'govuk-label--s',
    },
    id: 'ethnicity',
    name: 'ethnicity',
    classes: 'govuk-input--width-20',
    attributes: {
      'data-module': 'app-autocomplete',
    },
    items: [],
  },
  // move details
  to_location: {},
  move_type: {
    ...moveType,
    items: [
      {
        id: 'move_type',
        value: 'court_appearance',
        text: 'fields::move_type.items.court_appearance.label',
        conditional: 'to_location_court_appearance',
      },
      // TODO: Remove once we want to allow this journey
      // {
      //   value: 'prison',
      //   text: 'fields::move_type.items.prison.label',
      //   conditional: 'to_location_prison',
      // },
    ],
  },
  move_type__police: {
    ...moveType,
    items: [
      {
        id: 'move_type',
        value: 'court_appearance',
        text: 'fields::move_type.items.court_appearance.label',
        conditional: 'to_location_court_appearance',
      },
      {
        value: 'prison_recall',
        text: 'fields::move_type.items.prison_recall.label',
        conditional: 'additional_information',
      },
    ],
  },
  to_location_court_appearance: toLocationType('court_appearance', {
    validate: 'required',
  }),
  to_location_prison: toLocationType('prison', {
    validate: 'required',
  }),
  additional_information: {
    skip: true,
    rows: 3,
    component: 'govukTextarea',
    classes: 'govuk-input--width-20',
    label: {
      text: 'fields::additional_information.label',
      classes: 'govuk-label--s',
    },
  },
  date: {},
  date_type: {
    validate: 'required',
    component: 'govukRadios',
    name: 'date_type',
    fieldset: {
      legend: {
        text: 'fields::date_type.label',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    items: [
      {
        id: 'date_type',
        value: 'today',
        text: 'fields::date_type.items.today.label',
      },
      {
        value: 'tomorrow',
        text: 'fields::date_type.items.tomorrow.label',
      },
      {
        value: 'custom',
        text: 'fields::date_type.items.another.label',
        conditional: 'date_custom',
      },
    ],
  },
  date_custom: {
    ...dateField,
    validate: [...dateField.validate, 'after'],
    skip: true,
    dependent: {
      field: 'date_type',
      value: 'custom',
    },
    id: 'date_custom',
    name: 'date_custom',
    label: {
      text: 'fields::date_custom.label',
      classes: 'govuk-label--s',
    },
  },
  date_from: {
    ...dateField,
    validate: [...dateField.validate, 'after'],
    id: 'date_from',
    name: 'date_from',
    label: {
      text: 'fields::date_from.label',
      classes: 'govuk-label--s',
    },
  },
  has_date_to: {
    validate: 'required',
    component: 'govukRadios',
    name: 'has_date_to',
    fieldset: {
      legend: {
        text: 'fields::has_date_to.legend',
        classes: 'govuk-label--m',
      },
    },
    items: [
      {
        value: 'yes',
        text: 'Yes',
        conditional: 'date_to',
      },
      {
        value: 'no',
        text: 'No',
      },
    ],
  },
  date_to: {
    skip: true,
    ...dateField,
    validate: [...dateField.validate, 'after'],
    dependent: {
      field: 'has_date_to',
      value: 'yes',
    },
    id: 'date_to',
    name: 'date_to',
    label: {
      text: 'fields::date_to.label',
      classes: 'govuk-label--s',
    },
  },
  // risk information
  violent: assessmentQuestionComments,
  escape: assessmentQuestionComments,
  hold_separately: assessmentQuestionComments,
  self_harm: assessmentQuestionComments,
  concealed_items: assessmentQuestionComments,
  other_risks: requiredAssessmentQuestionComments,
  not_to_be_released: {
    ...requiredAssessmentQuestionComments,
    explicit: true,
  },
  // health information
  special_diet_or_allergy: assessmentQuestionComments,
  health_issue: assessmentQuestionComments,
  medication: assessmentQuestionComments,
  wheelchair: assessmentQuestionComments,
  pregnant: assessmentQuestionComments,
  other_health: requiredAssessmentQuestionComments,
  special_vehicle: {
    ...requiredAssessmentQuestionComments,
    explicit: true,
  },
  // court information
  solicitor: assessmentQuestionComments,
  interpreter: assessmentQuestionComments,
  other_court: requiredAssessmentQuestionComments,
  documents: {
    id: 'documents',
    name: 'documents',
    component: 'appMultiFileUpload',
    heading: {
      text: 'fields::documents.heading',
    },
    label: {
      text: 'fields::documents.label',
      classes: 'govuk-label--m',
    },
    hint: {
      text: 'fields::documents.hint',
    },
  },
  prison_transfer_reason: {
    id: 'prison_transfer_reason',
    name: 'prison_transfer_reason',
    validate: 'required',
    component: 'govukRadios',
    fieldset: {
      legend: {
        text: 'fields::prison_transfer_reason.label',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    items: [],
  },
  prison_transfer_reason_comments: {
    id: 'prison_transfer_reason_comments',
    name: 'prison_transfer_reason_comments',
    rows: 3,
    component: 'govukTextarea',
    label: {
      text: 'fields::prison_transfer_reason_comments.label',
      classes: 'govuk-label--s',
    },
    classes: 'govuk-input--width-20',
  },
  move_agreed: {
    validate: 'required',
    component: 'govukRadios',
    name: 'move_agreed',
    fieldset: {
      legend: {
        text: 'fields::move_agreed.label',
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      },
    },
    items: [
      {
        id: 'move_agreed',
        value: true,
        text: 'Yes',
        conditional: 'move_agreed_by',
      },
      {
        value: false,
        text: 'No',
      },
    ],
  },
  move_agreed_by: {
    id: 'move_agreed_by',
    name: 'move_agreed_by',
    skip: true,
    component: 'govukInput',
    classes: 'govuk-input--width-20',
    label: {
      text: 'fields::move_agreed_by.label',
      classes: 'govuk-label--s',
    },
    validate: 'required',
    dependent: {
      field: 'move_agreed',
      value: true,
    },
  },
  implicitAssessmentQuestions,
  explicitAssessmentQuestion,
}
