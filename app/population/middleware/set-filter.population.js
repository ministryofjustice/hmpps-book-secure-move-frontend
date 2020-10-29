function setFilterPopulation(items = [], bodyKey) {
  return async function buildFilter(req, res, next) {
    const { locations } = req
    const locationIds = locations?.join()

    const filter = {
      'filter[location_type]': 'prison',
      'filter[location_id]': locationIds,
    }
    req.filter = filter
    req.filterPopulation = filter
    next()
  }
}

module.exports = setFilterPopulation

// ...(locationIds && { location_id: locationIds }),
