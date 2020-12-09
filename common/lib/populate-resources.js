const findUnpopulatedResources = require('./find-unpopulated-resources')

const populateResources = async (obj, req, options, processed = []) => {
  const lookupMethods = {
    locations: req.services.referenceData.getLocationById,
    moves: req.services.move.getById,
    person_escort_records: req.services.personEscortRecord.getById,
  }
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

  return populateResources(obj, req, options, unpopulated)
}

module.exports = populateResources
