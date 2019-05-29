module.exports = {
  get: async (req, res, next) => {
    try {
      const redirectUrl = req.session.postAuthRedirect
      req.session.postAuthRedirect = null
      res.redirect(redirectUrl)
    } catch (error) {
      next(error)
    }
  },
}
