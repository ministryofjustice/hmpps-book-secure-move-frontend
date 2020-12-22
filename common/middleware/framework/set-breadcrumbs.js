const { snakeCase } = require('lodash')

function setBreadcrumbs(req, res, next) {
  const { assessment = {}, move } = req
  const moveId = move?.id || assessment?.move?.id
  const profile = move?.profile || assessment?.profile
  const frameworkName = assessment.framework.name

  res
    .breadcrumb({
      text: req.t('moves::detail.page_title', {
        name: profile.person._fullname,
      }),
      href: `/move/${moveId}`,
    })
    .breadcrumb({
      text: req.t('assessment::page_title', {
        context: snakeCase(frameworkName),
      }),
      href: move
        ? `/move/${moveId}/${frameworkName}`
        : `/${frameworkName}/${assessment.id}`,
    })

  next()
}

module.exports = setBreadcrumbs
