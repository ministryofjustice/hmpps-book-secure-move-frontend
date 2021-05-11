const cancellationReason = require('./cancellation-reason')
const cancellationReasonCancelledByPMUComment = require('./cancellation-reason-cancelled-by-pmu-comment')
const cancellationReasonOtherComment = require('./cancellation-reason-other-comment')

module.exports = {
  cancellation_reason: cancellationReason,
  cancellation_reason_cancelled_by_pmu_comment:
    cancellationReasonCancelledByPMUComment,
  cancellation_reason_other_comment: cancellationReasonOtherComment,
}
