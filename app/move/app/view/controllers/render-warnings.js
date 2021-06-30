function renderWarnings(req, res) {
  const locals = {}

  res
    .breadcrumb({ text: req.t('moves::tabs.warnings') })
    .render('move/app/view/views/warnings', locals)
}

module.exports = renderWarnings
