const services = require('../services')

const setServices = (req, res, next) => {
  req.services = Object.keys(services).reduce((acc, serviceKey) => {
    if (services[serviceKey] instanceof Function) {
      acc[serviceKey] = new services[serviceKey](req)
    } else {
      acc[serviceKey] = services[serviceKey]
    }

    return acc
  }, {})

  next()
}

module.exports = setServices
