/* eslint-disable no-console */
const timer = require('./timer')

const wrapMethodAsync = (methodName, method, methodOptions, context) => {
  return async (...args) => {
    const methodTimer = timer()

    try {
      const result = await method.apply(null, args)
      const duration = methodTimer()
      console.log(
        `${methodName}, success, took ${duration}, tId:${context?.transactionId}`
      )
      // TODO: metrics call
      // TODO: log success
      return result
    } catch (error) {
      const duration = methodTimer()
      console.log(`${methodName}, error, took ${duration}`, error.stack)
      // TODO: metrics call
      // TODO: log error
      throw error
    }
  }
}

const wrapMethodSync = (methodName, method, methodOptions) => {
  return (...args) => {
    const methodTimer = timer()

    try {
      const result = method.apply(null, args)
      const duration = methodTimer()
      console.log(`${methodName}, success, took ${duration}`)
      // TODO: metrics call
      // TODO: log success
      return result
    } catch (error) {
      const duration = methodTimer()
      console.log(`${methodName}, error, took ${duration}`)
      // TODO: metrics call
      // TODO: log error
      throw error
    }
  }
}

const wrapMethod = {
  async: wrapMethodAsync,
  sync: wrapMethodSync,
}

const wrapMethods = (name, service, options) => {
  Object.keys(options).forEach(methodKey => {
    const methodOptions = {
      async: true,
      log: true,
      metrics: true,
      ...(options[methodKey] === true ? {} : options[methodKey]),
    }

    const _method = service[methodKey]
    const methodName = `${name}.${methodKey}`
    const methodType = methodOptions.async ? 'async' : 'sync'

    service[methodKey] = wrapMethod[methodType](
      methodName,
      _method,
      methodOptions,
      service.context
    )
  })
}

module.exports = {
  wrapMethods,
}
