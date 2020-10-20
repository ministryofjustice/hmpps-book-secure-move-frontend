const services = require('../services')

const setServices = (req, res, next) => {
  const servicesCache = {}

  const servicesWithReq = Object.keys(services).reduce((acc, serviceKey) => {
    if (!servicesCache[serviceKey]) {
      const originalService = services[serviceKey]

      if (!originalService.addRequestContext) {
        servicesCache[serviceKey] = originalService
      } else {
        servicesCache[serviceKey] = originalService.addRequestContext(req)
      }
    }

    acc[serviceKey] = () => servicesCache[serviceKey]

    return acc
  }, {})
  req.services = servicesWithReq
  next()
}

module.exports = setServices
