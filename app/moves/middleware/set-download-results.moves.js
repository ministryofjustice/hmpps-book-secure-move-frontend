function setDownloadResultsMoves(bodyKey) {
  return async function handleResults(req, res, next) {
    try {
      req.results = await req.services.move.getDownload(req, req.body[bodyKey])
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setDownloadResultsMoves
