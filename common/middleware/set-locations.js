const pipe = functions => data => {
  return functions.reduce((value, func) => {
    if (value.locations) {
      return value
    }

    return func(value)
  }, data)
}

const getParamsLocation = data => {
  const { locationId } = data.req.params

  if (locationId) {
    data.locations = [{ id: locationId }]
  }

  return data
}

const getCurrentLocation = data => {
  const currentLocation = data.req.session?.currentLocation

  if (currentLocation) {
    data.locations = [currentLocation]
  }

  return data
}

const getCurrentRegion = data => {
  data.locations = data.req.session?.currentRegion?.locations
  return data
}

const getUserLocations = data => {
  if (data.req.session?.user?.supplierId) {
    return data
  }

  data.locations = data.req.session?.user?.locations
  return data
}

const getLocationIds = data => {
  const locations = data.locations || []
  return locations.map(location => location.id)
}

const setLocations = (req, res, next) => {
  const data = pipe([
    getParamsLocation,
    getCurrentLocation,
    getCurrentRegion,
    getUserLocations,
  ])({ req })

  req.locations = getLocationIds(data)

  next()
}

module.exports = setLocations
