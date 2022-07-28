async function setDownloadResultsSingleRequests(req, res, next) {
  const singleRequestService = req.services.singleRequest

  try {
    req.results = await singleRequestService.getDownload(
      req,
      req.body.requested
    )
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setDownloadResultsSingleRequests
