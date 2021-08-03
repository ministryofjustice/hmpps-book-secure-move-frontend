module.exports = (req, res, next) => {
  const { _fullname: name } = req.person || {}

  if (name) {
    res.breadcrumb({
      text: name,
      href: req.baseUrl,
    })
  }

  next()
}
