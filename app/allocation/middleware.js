async function setAllocation(req, res, next, allocationId) {
  if (!allocationId) {
    return next()
  }

  try {
    req.allocation = await req.services.allocation.getById(allocationId)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  setAllocation,
}
