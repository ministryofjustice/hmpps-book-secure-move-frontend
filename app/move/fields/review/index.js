const moveDate = require('./move-date')
const rejectionReasonComment = require('./rejection-reason-comment')
const reviewDecision = require('./review-decision')

module.exports = {
  move_date: moveDate,
  review_decision: reviewDecision,
  rejection_reason_comment: rejectionReasonComment,
}
