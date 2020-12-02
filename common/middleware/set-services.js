const services = require('../services')

const setServices = (req, res, next) => {
  const servicesCache = {}

  const servicesWithReq = Object.keys(services).reduce((acc, serviceKey) => {
    if (!servicesCache[serviceKey]) {
      servicesCache[serviceKey] = services[serviceKey]
    }

    acc[serviceKey] = () => servicesCache[serviceKey]

    return acc
  }, {})

  req.services = servicesWithReq

  next()
}

module.exports = setServices
