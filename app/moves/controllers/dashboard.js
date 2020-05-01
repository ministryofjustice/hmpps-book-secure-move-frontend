module.exports = function dashboard(req, res) {
  res.render('moves/views/dashboard', {
    pageTitle: 'dashboard::page_title',
  })
}
