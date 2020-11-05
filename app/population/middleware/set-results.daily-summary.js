async function setResultsDailySummmary(req, res, next) {
  req.resultsAsDailySummary = req.body.population?.freeSpaces

  next()
}

module.exports = setResultsDailySummmary
