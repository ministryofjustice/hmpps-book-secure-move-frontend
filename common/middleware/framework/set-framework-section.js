function setFrameworkSection(req, res, next, key) {
  const section = req.framework?.sections[key]

  if (section) {
    req.frameworkSection = section
    return next()
  }

  const error = new Error('Framework section not found')
  error.statusCode = 404

  next(error)
}

module.exports = setFrameworkSection
