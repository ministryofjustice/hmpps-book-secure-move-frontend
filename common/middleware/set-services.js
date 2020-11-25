const services = require('../services')

const setServices = (req, res, next) => {
  const servicesRequestContext = {}

  req.services = Object.keys(services).reduce((acc, serviceKey) => {
    if (!servicesRequestContext[serviceKey]) {
      const originalService = services[serviceKey]

      if (!originalService.addRequestContext) {
        servicesRequestContext[serviceKey] = originalService
      } else {
        servicesRequestContext[serviceKey] = originalService.addRequestContext(
          req
        )
      }
    }

    acc[serviceKey] = () => servicesRequestContext[serviceKey]

    return acc
  }, {})
  next()
}

module.exports = setServices
