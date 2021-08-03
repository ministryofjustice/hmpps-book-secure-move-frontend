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

function setBreadcrumb(req, res, next) {
  const { _fullname: name } = req.person || {}

  if (name) {
    res.breadcrumb({
      text: name,
      href: req.baseUrl,
    })
  }

  next()
}

module.exports = { setPerson, setBreadcrumb }
