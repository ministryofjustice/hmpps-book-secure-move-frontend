function setFilterPopulation(items = [], bodyKey) {
  return function buildFilter(req, res, next) {
    const { locations } = req
    const locationIds = locations?.join()

    const filter = {
      'filter[location_id]': locationIds,
    }
    req.filter = filter
    req.filterPopulation = filter

    next()
  }
}

module.exports = setFilterPopulation
