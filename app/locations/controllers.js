const { get, uniqBy } = require('lodash')

async function locations(req, res, next) {
  const userPermissions = get(req.session, 'user.permissions', [])

  let regions = []

  if (userPermissions.includes('allocation:create')) {
    try {
      regions = await req.services.referenceData.getRegions()
    } catch (error) {
      return next(error)
    }
  }

  let userLocations = req.userLocations

  const supplierId = req.session.user.supplierId

  if (supplierId) {
    userLocations = await req.services.referenceData.getLocationsBySupplierId(
      supplierId
    )
  }

  if (userPermissions.includes('locations:contract_delivery_manager')) {
    const suppliers = await req.services.referenceData.getSuppliers()
    const supplierLocations = await Promise.all(
      suppliers.map(async supplier => {
        const locations = await req.services.referenceData.getLocationsBySupplierId(
          supplier.id
        )
        return locations
      })
    )

    // The locations have been uniqued based on title to prevent
    // duplicates when multiple suppliers have the same location
    userLocations = uniqBy(supplierLocations.flat(), 'id')
  }

  req.session.user.locations = userLocations

  const activeLocations = userLocations.filter(
    location => location.disabled_at === null
  )
  const inactiveLocations = userLocations.filter(
    location => location.disabled_at !== null
  )

  res.render('locations/views/locations.njk', {
    activeLocations,
    inactiveLocations,
    regions,
  })
}

module.exports = {
  locations,
}
