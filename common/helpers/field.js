const { cloneDeep, fromPairs, get, set } = require('lodash')
const { format, parseISO } = require('date-fns')

const componentService = require('../services/component')
const i18n = require('../../config/i18n')
const referenceDataService = require('../../common/services/reference-data')
const referenceDataHelpers = require('../../common/helpers/reference-data')

const SUFFIX_YESNO = '__yesno'

function mapReferenceDataToOption({ id, title, key, conditional, hint }) {
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
        const fieldName = item.conditional
        const field = fields[fieldName]

        if (!field) {
          return item
        }

        const params = { ...field, id: fieldName, name: fieldName }
        const html = componentService.getComponent(params.component, params)

        return { ...item, conditional: { html } }
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

function setFieldError(errors, translate) {
  return ([key, field]) => {
    const fieldError = errors[key]

    if (!fieldError) {
      return [key, field]
    }

    const label = translate(`fields::${fieldError.key}.label`)
    const message = translate(`validation::${fieldError.type}`)

    return [
      key,
      {
        ...field,
        errorMessage: {
          html: `${label} ${message}`,
        },
      },
    ]
  }
}

function translateField(translate) {
  return ([key, field]) => {
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
    ]

    translationPaths.forEach(path => {
      const key = get(translated, path)
      if (key) {
        set(translated, path, translate(key))
      }
    })

    if (field.items) {
      translated.items = Object.entries(field.items)
        .map(translateField(translate))
        .map(item => item[1])
    }

    return [key, translated]
  }
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

function setDependentValidation(key, field, fieldWithItems) {
  if (!field.validate) {
    return
  }

  const fieldItem = fieldWithItems.items.find(item => key.includes(item.key))

  field.dependent = {
    field: fieldWithItems.name,
    value: fieldItem.value,
  }
}

async function populateAssessmentQuestions(fields) {
  const fieldsClone = { ...fields }
  const fieldWithItems = Object.values(fieldsClone).find(field => {
    if (Object.prototype.hasOwnProperty.call(field, 'items')) {
      return true
    }
  })

  if (fieldWithItems) {
    const assessmentQuestions = await referenceDataService.getAssessmentQuestions(
      fieldWithItems.name
    )

    fieldWithItems.items = assessmentQuestions
      .filter(referenceDataHelpers.filterDisabled())
      .map(mapAssessmentQuestionToConditionalField)
      .map(mapAssessmentQuestionToTranslation)
      .map(mapReferenceDataToOption)

    Object.entries(fieldsClone).forEach(([key, field]) =>
      setDependentValidation(key, field, fieldWithItems)
    )
  }

  return fieldsClone
}

function mapPersonToOption(person) {
  return {
    text: person.fullname.toUpperCase(),
    label: {
      classes: 'govuk-label--s',
    },
    value: person.id,
    hint: {
      html: componentService.getComponent('appResults', {
        items: [
          {
            label: 'Date of Birth',
            text: format(parseISO(person.date_of_birth), 'd MMM yyyy'),
          },
          {
            label: 'Gender',
            text: person.gender.title,
          },
        ],
      }),
    },
  }
}

function appendDependent(field, category, question) {
  if (field.explicit) {
    field.dependent = {
      field: `${question.key}${SUFFIX_YESNO}`,
      value: 'yes',
    }
  } else {
    field.dependent = {
      field: category,
      value: question.id,
    }
  }
}

module.exports = {
  mapAssessmentQuestionToConditionalField,
  mapAssessmentQuestionToTranslation,
  mapReferenceDataToOption,
  renderConditionalFields,
  setFieldValue,
  setFieldError,
  translateField,
  insertInitialOption,
  insertItemConditional,
  populateAssessmentQuestions,
  mapPersonToOption,
  appendDependent
}
