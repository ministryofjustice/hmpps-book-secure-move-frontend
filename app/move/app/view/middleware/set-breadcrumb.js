function setBreadcrumb(req, res, next) {
  const { profile, reference } = req.move || {}
  const name = profile?.person?._fullname

  if (reference) {
    res.breadcrumb({
      text: `${reference}${name ? ` (${name})` : ''}`,
      href: req.baseUrl,
    })
  }

  next()
}

module.exports = setBreadcrumb
