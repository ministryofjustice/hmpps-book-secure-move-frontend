const MOUNTPATH = '/population'

const BASE_PATH = `/:period/:date`

const DAILY_PATH = `/day/:date/:locationId`
const WEEKLY_PATH = `/week/:date/:locationId`

module.exports = {
  BASE_PATH,
  DAILY_PATH,
  MOUNTPATH,
  WEEKLY_PATH,
}
