function dashboard(req, res) {
  res.render('move-requests/views/dashboard.njk', {})
}

function redirect(req, res) {
  const redirectUrl = req.session.originalRequestUrl || '/'

  req.session.originalRequestUrl = null

  res.redirect(redirectUrl)
}

module.exports = {
  dashboard,
  redirect,
}
