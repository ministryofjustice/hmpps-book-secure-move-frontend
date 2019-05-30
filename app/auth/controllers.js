module.exports = {
  get: (req, res) => {
    const redirectUrl = req.session.postAuthRedirect
    req.session.postAuthRedirect = null
    res.redirect(redirectUrl)
  },
}
