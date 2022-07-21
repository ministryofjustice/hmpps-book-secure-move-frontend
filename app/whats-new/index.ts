// Dependencies
const router = require('express').Router()

const contentfulService = require('../../common/services/contentful')

// Define routes
router.get('/',async (req: any, res: any, next: any) => {
  let content

  try {
    content = await contentfulService.fetch()
  } catch (e) {
    return next(e)
  }

  res.render('whats-new/whats-new', {
    posts: content.posts,
  })
})

router.get('/:id', async (req: any, res: any, next: any) => {
  let content

  try {
    content = await contentfulService.fetchEntryBySlugId(req.params.id)
  } catch (e) {
    return next(e)
  }

  res.render('whats-new/content', {
    post: content
  })
})

// Export
module.exports = {
  router,
  mountpath: '/whats-new',
}
