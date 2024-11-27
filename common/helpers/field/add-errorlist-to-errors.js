const getFieldErrorMessage = require('./get-field-error-message')

function addErrorListToErrors(errors = {}, fields) {
  const errorList = Object.keys(errors).map(errorKey => {
    const error = errors[errorKey]
    const field = fields[error.key]
    const { message } = error

    if (
      ['Enter the seal number', 'Select the types of property'].includes(
        message
      )
    ) {
      const { prefix } = field
      const index = Number(prefix.match(/property-bags\[(\d+)\]/)[1])
      error.message = `${message} for bag ${index + 1}`
    }

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
