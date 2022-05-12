const router = require('express').Router()

const whatsNewContentService = require('../../common/services/whats-new-content')

router.get('/', async (req, res, next) => {
  let content

  try {
    content = await whatsNewContentService.fetchAll()
  } catch (e) {
    return next(e)
  }

  res.render('whats-new/whats-new', {
    posts: content.posts,
  })
})

router.get('/:id', async (req, res, next) => {
  let post

  try {
    post = await whatsNewContentService.fetchOne(req.params.id)
  } catch (e) {
    return next(e)
  }

  res.render('whats-new/detail', { post })
})

module.exports = { router, mountpath: '/whats-new' }
