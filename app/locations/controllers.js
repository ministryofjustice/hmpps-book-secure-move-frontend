const { get, sortBy } = require('lodash')

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
    req.session.user.locations = userLocations
  }

  if (userPermissions.includes('locations:contract_delivery_manager')) {
    const suppliers = await req.services.referenceData.getSuppliers()
    const supplierLocations = await Promise.all(
      suppliers.map(async supplier => {
        return await req.services.referenceData.getLocationsBySupplierId(
          supplier.id
        )
      })
    )

    userLocations = [...new Set(supplierLocations.flat())]

    req.session.user.locations = userLocations
  }

  const locations = sortBy(userLocations, 'title')

  res.render('locations/views/locations.njk', {
    locations,
    regions,
  })
}

module.exports = {
  locations,
}
