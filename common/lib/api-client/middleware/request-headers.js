const getRequestHeaders = require('../request-headers')

module.exports = {
  name: 'request-headers',
  req: function req(payload = {}) {
    if (payload.res) {
      return payload
    }

    const { jsonApi, req } = payload

    const { _originalReq } = jsonApi

    const requestHeadersOptions = {
      ...(_originalReq && {
        req: _originalReq,
      }),
    }

    req.headers = {
      ...req.headers,
      ...getRequestHeaders(requestHeadersOptions),
    }
    return payload
  },
}
