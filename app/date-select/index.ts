const router = require('express').Router()

const wizard = require('../../common/middleware/unique-form-wizard')

const config = require('./config')
const { MOUNTPATH } = require('./constants')
const fields = require('./fields')
const steps = require('./steps')

router.use('/', wizard(steps, fields, config))

module.exports = {
  router,
  mountpath: MOUNTPATH,
}
