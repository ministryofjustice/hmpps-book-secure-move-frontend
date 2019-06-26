const { fromPairs } = require('lodash')

const componentService = require('../services/component')

function mapReferenceDataToOption ({ id, title, key, conditional }) {
  const option = {
    value: id,
    text: title,
  }

  if (key) {
    option.key = key
  }

  if (conditional) {
    option.conditional = conditional
  }

  return option
}

function mapAssessmentQuestionToConditionalField (item) {
  return {
    ...item,
    conditional: `${item.category}__${item.key}`,
  }
}

function renderConditionalFields ([key, field], index, obj) {
  if (!field.items) {
    return [
      key,
      field,
    ]
  }

  const fields = fromPairs(obj)

  return [
    key,
    {
      ...field,
      items: field.items.map((item) => {
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

function insertInitialOption (items, label = 'option') {
  const initialOption = {
    text: `--- Choose ${label} ---`,
  }

  return [initialOption, ...items]
}

module.exports = {
  mapReferenceDataToOption,
  mapAssessmentQuestionToConditionalField,
  renderConditionalFields,
  insertInitialOption,
}
