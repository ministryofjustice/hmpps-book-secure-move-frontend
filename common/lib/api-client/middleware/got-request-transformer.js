const FormData = require('form-data')
const { omit } = require('lodash')

module.exports = {
  name: 'got-request-transformer',
  req: function req(payload) {
    // If payload already contains a response, bypass and call next middleware
    // This usecase is currently for cached requests
    // TODO: Remove if we switch to Got cache API
    if (payload.res) {
      return payload
    }

    const { req } = payload

    // Some properties have to be re-mapped for `Got`
    const gotReq = {
      ...omit(req, ['params', 'data']),
      searchParams: req.params,
      responseType: 'json',
    }

    if (req.data) {
      if (req.data instanceof FormData) {
        // Got uses `body` instead of `json` to send form-data
        gotReq.body = req.data
      } else {
        gotReq.json = req.data
      }
    }

    return {
      ...payload,
      req: gotReq,
    }
  },
}
