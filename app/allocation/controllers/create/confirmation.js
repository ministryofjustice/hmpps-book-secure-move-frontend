function confirmation(req, res) {
  const allocation = req.allocation

  res.render('allocation/views/confirmation', {
    allocation,
  })
}

module.exports = confirmation
