module.exports = {
  get: (req, res, next) => {
    const redirectUrl = req.session.postAuthRedirect
    req.session.postAuthRedirect = null
    res.redirect(redirectUrl)
  },
}
