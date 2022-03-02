// Dependencies
const router = require('express').Router()

const contentfulService = require('../../common/services/contentful')

// Define routes
router.get('/', async (req, res) => {
  const content = await contentfulService.fetchEntries()
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
