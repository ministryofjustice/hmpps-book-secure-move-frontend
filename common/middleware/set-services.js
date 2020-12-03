const services = require('../services')

const setServices = (req, res, next) => {
  req.services = Object.keys(services).reduce((acc, serviceKey) => {
    acc[serviceKey] = services[serviceKey]

    return acc
  }, {})

  next()
}

module.exports = setServices
