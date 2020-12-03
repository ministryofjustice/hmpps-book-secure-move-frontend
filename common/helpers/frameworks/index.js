const appendResponseToField = require('./append-response-to-field')
const mapFieldFromName = require('./map-field-from-name')
const mapItemToSection = require('./map-item-to-section')
const mapQuestionToResponse = require('./map-question-to-response')
const reduceResponsesToFormValues = require('./reduce-responses-to-form-values')
const renderNomisMappingsToField = require('./render-nomis-mappings-to-field')
const renderPreviousAnswerToField = require('./render-previous-answer-to-field')
const responsesToSaveReducer = require('./responses-to-save-reducer')
const setValidationRules = require('./set-validation-rules')

module.exports = {
  appendResponseToField,
  mapFieldFromName,
  mapQuestionToResponse,
  mapItemToSection,
  reduceResponsesToFormValues,
  renderNomisMappingsToField,
  renderPreviousAnswerToField,
  responsesToSaveReducer,
  setValidationRules,
}
