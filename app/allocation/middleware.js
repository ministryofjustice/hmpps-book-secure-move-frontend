const allocationService = require('../../common/services/allocation')

async function setAllocation(req, res, next, allocationId) {
  if (!allocationId) {
    return next()
  }
  try {
    res.locals.allocation = await allocationService.getById(allocationId)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  setAllocation,
}
