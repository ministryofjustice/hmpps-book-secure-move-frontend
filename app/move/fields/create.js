const { date } = require('../formatters')

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

function assessmentCategory(category) {
  return {
    component: 'govukCheckboxes',
    multiple: true,
    items: [],
    name: category,
    fieldset: {
      legend: {
        text: `fields::${category}.label`,
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: `fields::${category}.hint`,
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

module.exports = {
  // pnc search
  police_national_computer_search_term: {
    component: 'govukInput',
    label: {
      html: 'fields::police_national_computer_search_term.label',
      classes: 'govuk-label--s',
    },
    hint: {
      text: 'fields::police_national_computer_search_term.hint',
    },
    id: 'police-national-computer-search-term',
    name: 'police_national_computer_search_term',
    classes: 'govuk-input--width-20',
    autocomplete: 'off',
  },
  police_national_computer_search_term_result: {
    component: 'govukRadios',
    multiple: true,
    items: [],
    name: 'police_national_computer_search_term_result',
    fieldset: {
      legend: {
        text: 'fields::police_national_computer_search_term_result.label',
        classes: 'govuk-fieldset__legend--s',
      },
    },
  },
  // personal details
  police_national_computer: {
    validate: 'required',
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
    validate: ['required', 'date', 'before'],
    formatter: [date],
    component: 'govukInput',
    label: {
      text: 'fields::date_of_birth.label',
      classes: 'govuk-label--s',
    },
    hint: {
      text: 'fields::date_of_birth.hint',
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
  from_location: {},
  to_location: {},
  move_type: {
    validate: 'required',
    component: 'govukRadios',
    name: 'move_type',
    fieldset: {
      legend: {
        text: 'fields::move_type.label',
        classes: 'govuk-fieldset__legend--m',
      },
    },
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
      text: 'fields::date_custom.label',
      classes: 'govuk-label--s',
    },
    hint: {
      text: 'fields::date_custom.hint',
    },
    classes: 'govuk-input--width-10',
    autocomplete: 'off',
  },
  // risk information
  risk: assessmentCategory('risk'),
  risk__violent: assessmentQuestionComments,
  risk__escape: assessmentQuestionComments,
  risk__hold_separately: assessmentQuestionComments,
  risk__self_harm: assessmentQuestionComments,
  risk__concealed_items: assessmentQuestionComments,
  risk__other_risks: requiredAssessmentQuestionComments,
  // health information
  health: assessmentCategory('health'),
  health__special_diet_or_allergy: assessmentQuestionComments,
  health__health_issue: assessmentQuestionComments,
  health__medication: assessmentQuestionComments,
  health__wheelchair: assessmentQuestionComments,
  health__pregnant: assessmentQuestionComments,
  health__other_health: requiredAssessmentQuestionComments,
  // court information
  court: assessmentCategory('court'),
  court__solicitor: assessmentQuestionComments,
  court__interpreter: assessmentQuestionComments,
  court__other_court: requiredAssessmentQuestionComments,
}
