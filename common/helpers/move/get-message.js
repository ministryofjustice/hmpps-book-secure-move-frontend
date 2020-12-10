function getMessage(req) {
  const { move } = req
  const {
    status,
    cancellation_reason: cancellationReason,
    cancellation_reason_comment: cancellationComments,
    rejection_reason: rejectionReason,
    rebook,
  } = move

  const bannerStatuses = ['cancelled']

  const message = {
    messageTitle: bannerStatuses.includes(status)
      ? req.t('statuses::' + status, { context: cancellationReason })
      : undefined,
    messageContent: req.t('statuses::description', {
      context: rejectionReason || cancellationReason,
      comment: cancellationComments,
      cancellation_reason_comment: cancellationComments,
      rebook,
    }),
  }

  return message
}

module.exports = getMessage
