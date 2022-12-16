import { DedicatedContentService } from '../../common/services/contentful/dedicated-content'
import { WhatsNewService } from '../../common/services/contentful/whats-new'

// Dependencies
const router = require('express').Router()

// Define routes
router.get('/', async (req: any, res: any, next: any) => {
  let content

  try {
    content = await new WhatsNewService().fetch()
  } catch (e) {
    return next(e)
  }

  res.render('whats-new/whats-new', {
    posts: content?.posts,
  })
})

router.get('/:id', async (req: any, res: any, next: any) => {
  let content

  try {
    content = await new DedicatedContentService().fetchEntryBySlugId(
      req.params.id
    )
  } catch (e) {
    return next(e)
  }

  res.render('whats-new/content', {
    post: content,
  })
})

// Export
module.exports = {
  router,
  mountpath: '/whats-new',
}
