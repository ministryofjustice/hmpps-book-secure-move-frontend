const i18n = require('../../../config/i18n')

function getFieldErrorMessage({
  message,
  key: fieldKey,
  type: errorType,
} = {}) {
  if (!fieldKey) {
    return ''
  }

  if (message) {
    return message
  }

  const errorLabel = i18n.t(`fields::${fieldKey}.label`, {
    context: 'with_error',
  })
  const fallback = i18n.t(`validation::${errorType}`, {
    context: 'with_label',
    label: errorLabel.toLowerCase(),
  })
  return i18n.t([`fields::${fieldKey}.error_message`, fallback], {
    context: errorType,
  })
}

module.exports = getFieldErrorMessage
