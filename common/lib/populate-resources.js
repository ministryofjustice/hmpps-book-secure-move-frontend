const moveService = require('../services/move')
const personEscortRecordService = require('../services/person-escort-record')
const referenceDataService = require('../services/reference-data')

const findUnpopulatedResources = require('./find-unpopulated-resources')

const lookupMethods = {
  locations: referenceDataService.getLocationById,
  moves: moveService.getById,
  person_escort_records: personEscortRecordService.getById,
}

const populateResources = async (obj, options, processed = []) => {
  const unpopulated = findUnpopulatedResources(obj, options).filter(
    resource => !processed.includes(resource)
  )

  if (!unpopulated.length) {
    return
  }

  for (const resource of unpopulated) {
    const lookupMethod = lookupMethods[resource.type]

    if (lookupMethod) {
      const newProp = await lookupMethod(resource.id)
      Object.keys(newProp).forEach(prop => {
        resource[prop] = newProp[prop]
      })
    }
  }

  return populateResources(obj, options, unpopulated)
}

module.exports = populateResources
