module.exports = function intercept(req, res, next) {
  const { emailFallback } = req

  if (emailFallback) {
    return res.render('document-emailed', {
      backLink: res.locals.MOVES_URL,
      pageTitle: 'Requested document emailed to you',
    })
  }

  next()
}
