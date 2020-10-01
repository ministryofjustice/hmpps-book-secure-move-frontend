const appendResponseToField = require('./append-response-to-field')
const mapFieldFromName = require('./map-field-from-name')
const reduceResponsesToFormValues = require('./reduce-responses-to-form-values')
const renderNomisMappingsToField = require('./render-nomis-mappings-to-field')
const responsesToSaveReducer = require('./responses-to-save-reducer')

module.exports = {
  mapFieldFromName,
  appendResponseToField,
  reduceResponsesToFormValues,
  renderNomisMappingsToField,
  responsesToSaveReducer,
}
