// Dependencies
const router = require('express').Router()

const whatsNewContentService = require('../../common/services/whats-new-content')

// Define routes
router.get('/', async (req, res, next) => {
  const content = await whatsNewContentService.fetch()

  if (content.error === 'ServerError') {
    const error = new Error('Contentful servers are down')
    error.statusCode = 500
    return next(error)
  } else {
    res.render('whats-new/whats-new', {
      posts: content.posts,
    })
  }
})

// Export
module.exports = {
  router,
  mountpath: '/whats-new',
}
