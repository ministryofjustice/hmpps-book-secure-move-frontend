const findUnpopulatedResources = require('./find-unpopulated-resources')

const populateResources = async (obj, req, options, processed = []) => {
  const services = {
    locations: {
      service: req.services.referenceData,
      method: 'getLocationById',
    },
    moves: {
      service: req.services.move,
      method: 'getById',
    },
    person_escort_records: {
      service: req.services.personEscortRecord,
      method: 'getById',
    },
  }
  const unpopulated = findUnpopulatedResources(obj, options).filter(
    resource => !processed.includes(resource)
  )

  if (!unpopulated.length) {
    return
  }

  for (const resource of unpopulated) {
    const { service, method } = services[resource.type] || {}

    if (service) {
      const newProp = await service[method](resource.id)
      Object.keys(newProp).forEach(prop => {
        resource[prop] = newProp[prop]
      })
    }
  }

  return populateResources(obj, req, options, unpopulated)
}

module.exports = populateResources
