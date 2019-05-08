module.exports = {
  get: (req, res) => {
    const params = {
      pageTitle: 'Upcoming moves',
    }
    res.render('dashboard/dashboard', params)
  },
}
