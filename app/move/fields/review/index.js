const cancellationReasonOtherComment = require('./cancellation-reason-comment')
const moveDate = require('./move-date')
const rebook = require('./rebook')
const rejectionReason = require('./rejection-reason')
const reviewDecision = require('./review-decision')

module.exports = {
  move_date: moveDate,
  review_decision: reviewDecision,
  rebook,
  rejection_reason: rejectionReason,
  cancellation_reason_other_comment: cancellationReasonOtherComment,
}
