const { dateRegex } = require('../../common/helpers/url')

const MOUNTPATH = '/population'

const BASE_PATH = `/:period(week|day)/:date(${dateRegex})`

module.exports = {
  BASE_PATH,
  MOUNTPATH,
}
