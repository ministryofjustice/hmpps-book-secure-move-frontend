function setUrls(req, res, next) {
  const { id: moveId } = req.move
  const urls = {
    warnings: `${req.baseUrl}/warnings`,
    details: `${req.baseUrl}/details`,
    timeline: `${req.baseUrl}/timeline`,
    person_escort_record: `/move/${moveId}/person-escort-record`,
    youth_risk_assessment: `/move/${moveId}/youth-risk-assessment`,
  }

  res.locals.urls = {
    move: urls,
  }

  next()
}

module.exports = setUrls
