function frameworkOverview(req, res) {
  const { framework } = req

  res.render('person-escort-record/views/overview', {
    framework,
  })
}

module.exports = frameworkOverview
