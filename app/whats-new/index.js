// Dependencies
const router = require('express').Router()

const whatsNewContentService = require('../../common/services/whats-new-content')

// Define routes
router.get('/', async (req, res) => {
  const content = await whatsNewContentService.fetchWhatsNewContent()
  res.render('whats-new/whats-new', {
    contentTitle: content.title,
    contentBody: content.body,
  })
})

// Export
module.exports = {
  router,
  mountpath: '/whats-new',
}
