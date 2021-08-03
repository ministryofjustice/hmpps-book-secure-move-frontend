async function setPerson(req, res, next) {
  const personId = req.params.personId

  if (!personId) {
    return next()
  }

  try {
    req.person = await req.services.person.getById(personId)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { setPerson }
