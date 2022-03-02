// Dependencies
const router = require('express').Router()

const contentfulService = require('../../common/services/contentful')

// Define routes
router.get('/', (req, res) => res.redirect('/whats-new/views/content'))
router.get('/content', async (req, res) => {
  const content = await contentfulService.fetchEntries()

  res.render('whats-new/views/content', {
    contentTitle: content.title,
    contentBody: content.body,
  })
})

// Export
module.exports = {
  router,
  mountpath: '/whats-new',
}
