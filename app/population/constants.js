const { dateRegex, uuidRegex } = require('../../common/helpers/url')

const MOUNTPATH = '/population'

const BASE_PATH = `/:period(week|day)/:date(${dateRegex})`

const DAILY_PATH = `/day/:date(${dateRegex})/:locationId(${uuidRegex})`

module.exports = {
  BASE_PATH,
  MOUNTPATH,
  DAILY_PATH,
}
