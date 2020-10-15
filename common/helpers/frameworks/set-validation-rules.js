const { cloneDeep, find, set } = require('lodash')

function setValidationRules(responses = []) {
  return ([key, field]) => {
    const response = find(responses, [
      'question.key',
      field.dependentQuestionKey,
    ])

    if (!response || !field.validate) {
      return [key, field]
    }

    const { nomis_mappings: nomisMappings = [] } = response
    const clonedField = cloneDeep(field)

    clonedField.validate = clonedField.validate.map(validation => {
      return {
        ...validation,
        type: validation.type.replace(
          'required_unless_nomis_mappings',
          'required'
        ),
      }
    })

    if (nomisMappings.length > 0) {
      set(clonedField, 'label.text', `${clonedField.label.text} (optional)`)

      clonedField.validate = clonedField.validate.filter(
        validation => validation.type !== 'required'
      )
    }

    return [key, clonedField]
  }
}

module.exports = setValidationRules
