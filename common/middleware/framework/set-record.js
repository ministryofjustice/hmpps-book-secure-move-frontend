function setRecord(key, serviceName, methodName) {
  return async (req, res, next) => {
    const resourceId = req.params?.resourceId

    if (req[key]) {
      return next()
    }

    if (!resourceId) {
      const error = new Error(`Resource (${key}) not found`)
      error.statusCode = 404
      return next(error)
    }

    try {
      req[key] = await req.services[serviceName][methodName](resourceId)

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setRecord
