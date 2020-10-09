const { find, set, cloneDeep } = require('lodash')

const i18n = require('../../../config/i18n')
const frameworkNomisMappingsToPanel = require('../../presenters/framework-nomis-mappings-to-panel')

function renderNomisMappingsToField(responses = []) {
  return ([key, field]) => {
    const response = find(responses, ['question.key', key])

    if (!response) {
      return [key, field]
    }

    const {
      nomis_mappings: mappings = [],
      person_escort_record: personEscortRecord = {},
    } = response

    if (mappings.length === 0) {
      return [key, field]
    }

    const copy = cloneDeep(field)
    let hintContent = copy.hint?.html || ''

    hintContent += frameworkNomisMappingsToPanel({
      heading: i18n.t(
        'person-escort-record::nomis_mappings.information_to_be_included'
      ),
      updatedAt: personEscortRecord.created_at,
      mappings,
    })

    set(copy, 'hint.classes', 'markdown')
    set(copy, 'hint.html', hintContent)

    return [key, copy]
  }
}

module.exports = renderNomisMappingsToField
