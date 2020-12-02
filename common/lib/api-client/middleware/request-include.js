module.exports = {
  name: 'request-include',
  req: function req(payload = {}) {
    if (payload.res) {
      return payload
    }

    const { req } = payload

    let include = req.params.include

    if (Array.isArray(include)) {
      include = include.sort().join(',')
    }

    if (include) {
      req.params.include = include
    } else {
      delete req.params.include
    }

    return payload
  },
}
