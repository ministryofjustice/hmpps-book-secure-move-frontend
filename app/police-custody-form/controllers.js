exports.addEvents = function (req, res) {
  const moveId = req.body.moveId

  res.redirect(`move/${moveId}/timeline`)
}
