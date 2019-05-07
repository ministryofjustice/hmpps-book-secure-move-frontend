module.exports = {
  get: (req, res) => {
    const params = {
      message: `Hello, world!`,
    }
    res.render('index/index', params)
  },
}
