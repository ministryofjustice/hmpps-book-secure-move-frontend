function setSectionBreadcrumb(req, res, next) {
  res.breadcrumb({
    text: req.frameworkSection.name,
    href: req.baseUrl,
  })

  next()
}

module.exports = setSectionBreadcrumb
