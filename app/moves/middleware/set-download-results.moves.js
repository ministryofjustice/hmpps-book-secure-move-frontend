function setDownloadResultsMoves(bodyKey) {
  return async function handleResults(req, res, next) {
    try {
      const results = await req.services.move.getDownload(
        req,
        req.body[bodyKey]
      )

      if (results.status === 202) {
        req.emailFallback = true
      } else {
        req.results = results.data
        req.emailFallback = false
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setDownloadResultsMoves
