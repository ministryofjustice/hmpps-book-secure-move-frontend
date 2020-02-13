const {
  cloneDeep,
  find,
  fromPairs,
  forEach,
  get,
  mapValues,
  set,
} = require('lodash')
const { format, parseISO } = require('date-fns')

const componentService = require('../services/component')
const i18n = require('../../config/i18n')
const { explicitYesNo } = require('../../app/move/fields/create')

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

function mapPersonToOption(person = {}) {
  return {
    text: person.fullname ? person.fullname.toUpperCase() : '',
    label: {
      classes: 'govuk-label--s',
    },
    value: person.id || '',
    hint: {
      html: componentService.getComponent('appResults', {
        items: [
          {
            label: 'Date of Birth',
            text: person.date_of_birth
              ? format(parseISO(person.date_of_birth), 'd MMM yyyy')
              : '',
          },
          {
            label: 'Gender',
            text: get(person, 'gender.title', ''),
          },
        ],
      }),
    },
  }
}

function appendDependent(questions, assessmentCategory, field, key) {
  const question = find(questions, { key })
  let dependent = {}

  if (question) {
    if (field.explicit) {
      dependent = {
        field: `${question.key}__yesno`,
        value: 'yes',
      }
    } else {
      dependent = {
        field: assessmentCategory,
        value: question.id,
      }
    }

    return {
      ...field,
      dependent,
    }
  }

  return field
}

function extractItemsForImplicitFields(fields, question) {
  const key = question.key
  const field = fields[key]
  return fields[key] && !field.explicit
}

function decorateWithExplicitFields(questions, collection, field, key) {
  const question = find(questions, { key })

  if (question && field.explicit) {
    const explicitKey = `${key}__yesno`
    const explicitField = explicitYesNo(explicitKey)
    explicitField.items[0].conditional = key
    collection[explicitKey] = explicitField
  }
}

function mapDependentFields(originalFields, questions, assessmentCategory) {
  let fields = cloneDeep(originalFields)
  fields = mapValues(
    fields,
    appendDependent.bind(null, questions, assessmentCategory)
  )
  fields = forEach(
    fields,
    decorateWithExplicitFields.bind(null, questions, fields)
  )
  return fields
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
  mapPersonToOption,
  appendDependent,
  extractItemsForImplicitFields,
  explicitYesNo,
  decorateWithExplicitFields,
  mapDependentFields,
}
