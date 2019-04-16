module.exports = (req, res) => {
  const params = {
    message: `Hello, world!`,
  }
  res.render('index/index', params)
}
