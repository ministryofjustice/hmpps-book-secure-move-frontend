const whatsNewContentService = require('../../common/services/whats-new-content')

module.exports = {
  fetchAll: async (req, res, next) => {
    try {
      res.locals.posts = (await whatsNewContentService.fetchAll()).posts
    } catch (e) {
      return next(e)
    }

    next()
  },
  fetchOne: async (req, res, next) => {
    try {
      res.locals.entry = await whatsNewContentService.fetchOne(req.params.id)
    } catch (e) {
      return next(e)
    }

    next()
  },
  setBreadcrumb: (req, res, next) => {
    res.breadcrumb({
      text: "What's new",
      href: '/whats-new',
    })

    const entry = res.locals.entry

    if (entry) {
      res.breadcrumb({
        text: entry.title,
        href: `/whats-new/${entry.id}`,
      })
    }

    next()
  },
}
