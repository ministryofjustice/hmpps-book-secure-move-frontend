module.exports = function requestTimeout(timeout) {
  return {
    name: 'request-timeout',
    req: payload => {
      if (payload.res) {
        return payload
      }

      if (payload.req) {
        payload.req.timeout = timeout
      }

      return payload
    },
  }
}
