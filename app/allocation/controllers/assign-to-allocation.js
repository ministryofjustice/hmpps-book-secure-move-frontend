function assignToAllocation(req, res) {
  const { allocation } = req
  const movesWithoutProfile = allocation.moves.filter(move => !move.profile)

  if (movesWithoutProfile.length) {
    return res.redirect(`/move/${movesWithoutProfile[0].id}/assign`)
  }

  res.redirect(`/allocation/${allocation.id}`)
}

module.exports = assignToAllocation
