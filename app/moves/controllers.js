module.exports = {
  get: (req, res, next) => {
    const params = {}
    res.render('moves/detail', params)
  },
}
