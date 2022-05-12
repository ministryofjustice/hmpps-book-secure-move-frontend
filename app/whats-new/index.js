const router = require('express').Router()

const breadcrumbs = require('../../common/middleware/breadcrumbs')

const { fetchAll, fetchOne, setBreadcrumb } = require('./middleware')

router.use(breadcrumbs.setHome())

router.get('/', fetchAll, setBreadcrumb, (req, res) => {
  res.render('whats-new/whats-new')
})

router.get('/:id', fetchOne, setBreadcrumb, (req, res) => {
  res.render('whats-new/detail')
})

module.exports = { router, mountpath: '/whats-new' }
