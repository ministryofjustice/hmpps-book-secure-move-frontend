function redirectOCAUser({ ocaMountpath, whitelist = [] } = {}) {
  return (req, res, next) => {
    if (whitelist.includes(req.url) || req.url.includes(ocaMountpath)) {
      return next()
    }
    if (res.locals && res.locals.USER && res.locals.USER.role === 'OCA') {
      req.session.originalRequestUrl = req.originalUrl
      return res.redirect(ocaMountpath)
    }
    return next()
  }
}

module.exports = redirectOCAUser
