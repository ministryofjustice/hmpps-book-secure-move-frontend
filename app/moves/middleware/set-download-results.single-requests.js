const singleRequestService = require('../../../common/services/single-request')

async function setDownloadResultsSingleRequests(req, res, next) {
  try {
    req.results = await singleRequestService.getDownload(req.body.requested)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setDownloadResultsSingleRequests
