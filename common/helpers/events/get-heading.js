const i18n = require('../../../config/i18n').default

const FORMATTED_STAKEHOLDERS = {
  prison_probation_staff: 'Prison or probation staff',
  healthcare: 'Healthcare staff',
  inspection_monitoring: 'Inspection or monitoring body staff',
  other: 'A professional visitor',
}

const getHeading = event => {
  const { event_type: eventType, _index, details, supplier } = event

  if (eventType === 'PerGeneric' && details.summary != null) {
    details.context = 'for_stakeholder'
    details.stakeholder_group = FORMATTED_STAKEHOLDERS[details.stakeholder]
  } else if (supplier === null) {
    details.context = 'without_supplier'
  }

  let heading = i18n.t(`events::${eventType}.heading`, details)

  if (_index) {
    heading += ` (${_index})`
  }

  return heading
}

module.exports = getHeading
