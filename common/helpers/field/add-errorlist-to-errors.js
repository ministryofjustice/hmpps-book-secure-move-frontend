const getFieldErrorMessage = require('./get-field-error-message')

function addErrorListToErrors(errors = {}, fields) {
  const errorList = Object.keys(errors).map(errorKey => {
    const error = errors[errorKey]
    const field = fields[error.key]
    return {
      html: getFieldErrorMessage({
        ...field,
        ...error,
      }),
      href: field.id ? `#${field.id}` : undefined,
    }
  })

  return {
    ...errors,
    errorList,
  }
}

module.exports = addErrorListToErrors
