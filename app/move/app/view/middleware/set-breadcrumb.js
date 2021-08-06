function setBreadcrumb(req, res, next) {
  const { profile, reference } = req.move || {}
  const name = profile?.person?._fullname

  if (reference) {
    res.breadcrumb({
      text: name ? `${name} (${reference})` : reference,
      href: req.baseUrl,
    })
  }

  next()
}

module.exports = setBreadcrumb
