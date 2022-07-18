// Dependencies
const router = require('express').Router()

const whatsNewContentService = require('../../common/services/whats-new-content')

// Define routes
router.get('/:id', async (req: any, res: any, next: any) => {
  let content

  try {
    content = await whatsNewContentService.fetchEntryBySlugId(req.params.id)
  } catch (e) {
    return next(e)
  }

  res.render('contnet/content', {
    post: content
  })
})

// Export
module.exports = {
  router,
  mountpath: '/content',
}
