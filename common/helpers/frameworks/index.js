const appendResponseToField = require('./append-response-to-field')
const mapFieldFromName = require('./map-field-from-name')
const reduceResponsesToFormValues = require('./reduce-responses-to-form-values')
const responsesToSaveReducer = require('./responses-to-save-reducer')

module.exports = {
  mapFieldFromName,
  appendResponseToField,
  reduceResponsesToFormValues,
  responsesToSaveReducer,
}
