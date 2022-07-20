// Dependencies
const router = require('express').Router()

const contentfulService = require('../../common/services/contentful')

// Define routes
router.get('/', async (req, res, next) => {
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

// Export
module.exports = {
  router,
  mountpath: '/whats-new',
}
