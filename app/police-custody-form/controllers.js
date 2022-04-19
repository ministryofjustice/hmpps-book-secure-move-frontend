exports.addEvents = async function (req, res) {
  const moveId = req.body.moveId
  const lockoutEvents = req.body
  const user = req.user
  const move = await req.services.move.getById(moveId)

  await req.services.event.postEvents(lockoutEvents, move, user)

  res.redirect(`move/${moveId}/timeline`)
}
