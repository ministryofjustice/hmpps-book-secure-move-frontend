module.exports = function ensureBodyProcessed(authMountpoint = '/auth') {
  return (req, res, next) => {
    if (!req.url.startsWith(authMountpoint)) {
      const originalBody = req.session.originalRequestBody
      if (originalBody) {
        delete req.session.originalRequestBody
        req.body = originalBody
        req.method = 'POST'
      }
    }
    next()
  }
}
