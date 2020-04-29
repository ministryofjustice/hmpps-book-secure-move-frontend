module.exports = function dashboard(req, res) {
  res.render('moves/views/dashboard', {
    pageTitle: 'moves::dashboard.dashboard',
  })
}
