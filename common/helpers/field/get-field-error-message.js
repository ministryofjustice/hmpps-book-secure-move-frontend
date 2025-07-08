const i18n = require('../../../config/i18n').default

function getFieldErrorMessage({
  message,
  description = '',
  question = '',
  key: fieldKey,
  type: errorType,
  objectType,
} = {}) {
  if (!fieldKey) {
    return ''
  }

  if (message) {
    return message
  }

  const labelFallback = description || question
  const errorLabel = i18n.t([`fields::${fieldKey}.label`, labelFallback], {
    context: 'with_error',
  })
  const fallback = i18n.t(`validation::${errorType}`, {
    context: 'with_label',
    label: errorLabel,
  })
  return i18n.t([`fields::${fieldKey}.error_message`, fallback], {
    context: errorType,
    objectType,
  })
}

module.exports = getFieldErrorMessage
