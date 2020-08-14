const {
  cloneDeep,
  compact,
  concat,
  fromPairs,
  get,
  mapValues,
  set,
} = require('lodash')

const assessmentCheckboxes = require('../../../app/move/fields/common.assessment-checkboxes')
const explicitAssessmentAnswer = require('../../../app/move/fields/common.explicit-assessment-answer')
const i18n = require('../../../config/i18n')
const componentService = require('../../services/component')

const flattenConditionalFields = require('./flatten-conditional-fields')
const getFieldErrorMessage = require('./get-field-error-message')
const isAllowedDependent = require('./is-allowed-dependent')
const reduceDependentFields = require('./reduce-dependent-fields')
const setFieldError = require('./set-field-error')
const setOptionalLabel = require('./set-optional-label')

function mapReferenceDataToOption({
  id,
  title,
  key,
  conditional,
  hint,
  checked,
}) {
  const option = {
    value: id,
    text: title,
  }

  if (hint) {
    option.hint = { text: hint }
  }

  if (key) {
    option.key = key
  }

  if (checked) {
    option.checked = checked
  }

  if (conditional) {
    option.conditional = conditional
  }

  return option
}

function mapAssessmentQuestionToTranslation(item) {
  const { category, key, title } = item
  const hintKey = `fields::${category}.items.${key}.hint`
  const labelKey = `fields::${category}.items.${key}.label`

  return {
    ...item,
    hint: i18n.exists(hintKey) ? hintKey : undefined,
    title: i18n.exists(labelKey) ? labelKey : title,
  }
}

function mapAssessmentQuestionToConditionalField(item) {
  return {
    ...item,
    conditional: item.key,
  }
}

function renderConditionalFields([key, field], index, obj) {
  if (!field.items) {
    return [key, field]
  }

  const fields = fromPairs(obj)

  return [
    key,
    {
      ...field,
      items: field.items.map(item => {
        const conditionalFields = concat([], item.conditional)

        const components = conditionalFields.map(conditionalFieldKey => {
          const conditionalField = fields[conditionalFieldKey]

          if (!conditionalField) {
            return
          }

          return componentService.getComponent(conditionalField.component, {
            ...conditionalField,
            id: conditionalFieldKey,
            name: conditionalFieldKey,
          })
        })

        if (!compact(components).length) {
          return item
        }

        return { ...item, conditional: { html: components.join('') } }
      }),
    },
  ]
}

function setFieldValue(values) {
  return ([key, field]) => {
    if (!field.items) {
      return [key, { ...field, value: values[key] }]
    }

    return [
      key,
      {
        ...field,
        items: field.items.map(item => {
          const value = values[key]
          let selected = false

          if (!value) {
            return item
          }

          if (Array.isArray(value)) {
            selected = value.includes(item.value)
          } else {
            selected = item.value === value
          }

          return { ...item, selected, checked: selected }
        }),
      },
    ]
  }
}

function translateField([key, field]) {
  const translated = cloneDeep(field)
  const translationPaths = [
    'text',
    'html',
    'label.text',
    'label.html',
    'hint.text',
    'hint.html',
    'fieldset.legend.text',
    'fieldset.legend.html',
    'heading.text',
    'heading.html',
    'summaryHtml',
  ]

  translationPaths.forEach(path => {
    const key = get(translated, path)

    if (key) {
      set(translated, path, i18n.t(key, { context: field.context }))
    }
  })

  if (field.items) {
    translated.items = Object.entries(field.items)
      .map(translateField)
      .map(item => item[1])
  }

  return [key, translated]
}

function insertInitialOption(items, label = 'option') {
  const initialOption = {
    text: `--- Choose ${label} ---`,
  }

  return [initialOption, ...items]
}

function insertItemConditional({ key, field }) {
  return item => {
    if (item.key !== key) {
      return item
    }

    return {
      ...item,
      conditional: field,
    }
  }
}

function populateAssessmentFields(currentFields, questions) {
  const fields = mapValues(currentFields, field => cloneDeep(field))
  const implicitQuestions = questions.filter(
    ({ key }) => fields[key] && !fields[key].explicit
  )
  const explicitQuestions = questions.filter(
    ({ key }) => fields[key] && fields[key].explicit
  )

  if (implicitQuestions.length) {
    const implicitFieldName = implicitQuestions[0].category
    const implicitField = assessmentCheckboxes(implicitFieldName)

    fields[implicitFieldName] = {
      ...implicitField,
      items: implicitQuestions
        .map(mapAssessmentQuestionToConditionalField)
        .map(mapAssessmentQuestionToTranslation)
        .map(mapReferenceDataToOption),
    }

    implicitQuestions.forEach(({ key, id }) => {
      fields[key].dependent = {
        field: implicitFieldName,
        value: id,
      }
    })
  }

  explicitQuestions.forEach(({ key, id }) => {
    const explicitField = `${key}__explicit`
    fields[explicitField] = explicitAssessmentAnswer({
      name: explicitField,
      value: id,
      conditional: key,
    })

    fields[key].dependent = {
      field: explicitField,
      value: id,
    }
  })

  return fields
}

module.exports = {
  mapAssessmentQuestionToConditionalField,
  mapAssessmentQuestionToTranslation,
  mapReferenceDataToOption,
  renderConditionalFields,
  getFieldErrorMessage,
  isAllowedDependent,
  setFieldValue,
  setFieldError,
  setOptionalLabel,
  translateField,
  insertInitialOption,
  insertItemConditional,
  populateAssessmentFields,
  flattenConditionalFields,
  reduceDependentFields,
}
