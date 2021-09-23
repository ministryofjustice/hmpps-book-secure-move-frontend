const { snakeCase } = require('lodash')

function setBreadcrumbs(req, res, next) {
  const { assessment = {}, move, originalUrl = '' } = req
  const moveId = move?.id || assessment?.move?.id
  const moveReference = move?.reference || assessment?.move?.reference
  const profile = move?.profile || assessment?.profile
  const frameworkName = assessment.framework.name

  res.breadcrumb({
    text: `${profile.person._fullname} (${moveReference})`,
    href: `/move/${moveId}`,
  })

  if (!originalUrl.includes('/handover')) {
    res.breadcrumb({
      text: req.t('assessment::page_title', {
        context: snakeCase(frameworkName),
      }),
      href: move
        ? `/move/${moveId}/${frameworkName}`
        : `/${frameworkName}/${assessment.id}`,
    })
  }

  next()
}

module.exports = setBreadcrumbs
