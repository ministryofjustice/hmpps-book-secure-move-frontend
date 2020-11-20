function setAssessment(key) {
  return (req, res, next) => {
    req.assessment = req[key]
    next()
  }
}

module.exports = setAssessment
