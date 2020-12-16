const getMoveUrls = (moveId, options = {}) => {
  const urls = {
    view: `/move/${moveId}`,
    timeline: `/move/${moveId}/timeline`,
    'person-escort-record': `/move/${moveId}/person-escort-record`,
    'youth-risk-assessment': `/move/${moveId}/youth-risk-assessment`,
    update: `/move/${moveId}/edit${options.entryPointUrl}`,
    assign: `/move/${moveId}/assign`,
    confirmation: `/move/${moveId}/confirmation`,
  }
  return urls
}

module.exports = getMoveUrls
