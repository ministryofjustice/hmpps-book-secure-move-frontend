const i18n = require('../../../config/i18n')

function getFieldErrorMessage(field, errorType) {
  const errorLabel = i18n.t(`fields::${field}.label`, {
    context: 'with_error',
  })
  const fallback = i18n.t(`validation::${errorType}`, {
    context: 'with_label',
    label: errorLabel.toLowerCase(),
  })
  return i18n.t([`fields::${field}.error_message`, fallback], {
    context: errorType,
  })
}

module.exports = getFieldErrorMessage
