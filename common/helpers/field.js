const { cloneDeep, concat, fromPairs, get, set, compact } = require('lodash')

const componentService = require('../services/component')
const i18n = require('../../config/i18n')
const {
  implicitAssessmentQuestions,
  explicitAssessmentQuestion,
} = require('../../app/move/fields/create')

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
        const conditionalFields = concat([], item.conditional)

        const components = conditionalFields.map(conditionalField => {
          const field = fields[conditionalField]

          if (!field) {
            return
          }

          return componentService.getComponent(field.component, {
            ...field,
            id: conditionalField,
            name: conditionalField,
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

function populateAssessmentFields(currentFields, questions) {
  const fields = cloneDeep(currentFields)
  const implicitQuestions = questions.filter(
    ({ key }) => fields[key] && !fields[key].explicit
  )
  const explicitQuestions = questions.filter(
    ({ key }) => fields[key] && fields[key].explicit
  )

  if (implicitQuestions.length) {
    const implicitFieldName = implicitQuestions[0].category
    const implicitField = implicitAssessmentQuestions(implicitFieldName)

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
    fields[explicitField] = explicitAssessmentQuestion(explicitField, id, key)

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
  setFieldValue,
  setFieldError,
  translateField,
  insertInitialOption,
  insertItemConditional,
  populateAssessmentFields,
}
