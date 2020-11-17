function daily(req, res) {
  const {
    context,
    details,
    totalSpace,
    availableSpace,
    unavailableSpace,
    transfersIn,
    transfersOut,
  } = req

  res.render('population/view/daily', {
    context,
    pageTitle: 'dashboard::page_title',
    details,
    totalSpace,
    availableSpace,
    unavailableSpace,
    transfersIn,
    transfersOut,
  })
}

module.exports = daily
