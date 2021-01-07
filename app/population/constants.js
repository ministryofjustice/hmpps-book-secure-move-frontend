const { dateRegex, uuidRegex } = require('../../common/helpers/url')

const MOUNTPATH = '/population'

const BASE_PATH = `/:period(week|day)/:date(${dateRegex})`

const DAILY_PATH = `/:period(day)/:date(${dateRegex})/:locationId(${uuidRegex})`
const WEEKLY_PATH = `/:period(week)/:date(${dateRegex})/:locationId(${uuidRegex})`

module.exports = {
  BASE_PATH,
  DAILY_PATH,
  MOUNTPATH,
  WEEKLY_PATH,
}
