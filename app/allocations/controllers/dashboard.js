module.exports = function dashboard(req, res) {
  res.render('allocations/views/dashboard', {
    pageTitle: 'allocations::dashboard.heading',
  })
}
