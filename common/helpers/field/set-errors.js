/**
 * Return errors in structured in same manner as form wizard
 *
 * @param {array.<object>} fieldErrors Field errors to set
 * @param {string} fieldErrors[*].key Field key
 * @param {string} fieldErrors[*].type Error type
 * @param {string} [fieldErrors[*].url] Error url
 * @param {object} [fieldErrors[*].args] Error args
 * @param {object} [errors] Pre-existing errors
 *
 * @returns {object} errors
 */
function setErrors(fieldErrors, errors = {}) {
  fieldErrors.forEach(fieldError => {
    const { key, type, url, args = {} } = fieldError
    errors[key] = {
      key,
      type,
      url,
      args,
    }
  })
  return errors
}

module.exports = setErrors
