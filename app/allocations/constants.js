const { dateRegex, uuidRegex } = require('../../common/helpers/url')

const MOUNTPATH = '/allocations'

const COLLECTION_PATH = `/:period(week|day)/:date(${dateRegex})/:locationId(${uuidRegex})?/:view(outgoing)`

module.exports = {
  COLLECTION_PATH,
  MOUNTPATH,
}
