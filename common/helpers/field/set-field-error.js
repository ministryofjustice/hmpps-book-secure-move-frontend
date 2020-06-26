const getFieldErrorMessage = require('./get-field-error-message')

function setFieldError(errors) {
  return ([key, field]) => {
    const fieldError = errors[key]

    if (!fieldError) {
      return [key, field]
    }

    return [
      key,
      {
        ...field,
        errorMessage: {
          html: getFieldErrorMessage(fieldError),
        },
      },
    ]
  }
}

module.exports = setFieldError
