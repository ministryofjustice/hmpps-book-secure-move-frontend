const cancellationReason = require('./cancellation-reason')
const cancellationReasonCancelledByPMUComment = require('./cancellation-reason-cancelled-by-pmu-comment')

module.exports = {
  cancellation_reason: cancellationReason,
  cancellation_reason_cancelled_by_pmu_comment:
    cancellationReasonCancelledByPMUComment,
}
