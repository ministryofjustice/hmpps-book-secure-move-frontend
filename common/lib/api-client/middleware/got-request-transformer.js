const FormData = require('form-data')
const { find, omit } = require('lodash')

module.exports = {
  name: 'got-request-transformer',
  req: function req(payload) {
    // If payload already contains a response, bypass and call next middleware
    // This usecase is currently for cached requests
    // TODO: Remove if we switch to Got cache API
    if (payload.res) {
      return payload
    }

    const { jsonApi, req } = payload

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

    if (req.params.paginate) {
      const responseMiddleware = find(jsonApi.middleware, {
        name: 'app-response',
      })

      gotReq.pagination = {
        // shouldContinue: (item, allItems, currentItems) => {
        //   return true
        // },
        transform: res => {
          const { data } = responseMiddleware.res({
            ...payload,
            res,
          })

          return data
        },
        paginate: ({ body }) => {
          const { data, links } = body
          const hasNext = links.next && data.length !== 0

          if (!hasNext) {
            return false
          }

          const nextUrl = new URL(links.next)

          return {
            searchParams: Object.fromEntries(nextUrl.searchParams),
          }
        },
      }

      delete gotReq.searchParams.paginate
    }

    return {
      ...payload,
      req: gotReq,
    }
  },
}
