// Dependencies
const router = require('express').Router()

const whatsNewContentService = require('../../common/services/whats-new-content')

// Define routes
router.get('/', async (req, res) => {
  const content = await whatsNewContentService.fetch()
  res.render('whats-new/whats-new', {
    posts: content.posts,
  })
})

// Export
module.exports = {
  router,
  mountpath: '/whats-new',
}
