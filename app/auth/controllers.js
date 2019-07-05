module.exports = {
  redirect: (req, res) => {
    const url = req.session.postAuthRedirect || '/'

    req.session.postAuthRedirect = null

    res.redirect(url)
  },
}
