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

function mapAssessmentConditionalFields (fields) {
  return function (item) {
    const fieldName = `${item.category}__${item.key}`
    const field = fields[fieldName]

    if (!field) {
      return item
    }

    const params = { ...field, id: fieldName, name: fieldName }
    const html = componentService.getComponent(params.component, params)

    return { ...item, conditional: { html } }
  }
}

function insertInitialOption (items, label = 'option') {
  const initialOption = {
    text: `--- Choose ${label} ---`,
  }

  return [initialOption, ...items]
}

module.exports = {
  mapReferenceDataToOption,
  mapAssessmentConditionalFields,
  insertInitialOption,
}
