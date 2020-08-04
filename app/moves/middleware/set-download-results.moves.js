const moveService = require('../../../common/services/move')

function setDownloadResultsMoves(bodyKey) {
  return async function handleResults(req, res, next) {
    try {
      req.results = await moveService.getDownload(req.body[bodyKey])
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setDownloadResultsMoves
