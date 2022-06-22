const i18n = require('../../../config/i18n').default

function getMessage(move) {
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
      ? i18n.t('statuses::' + status, { context: cancellationReason })
      : undefined,
    messageContent: i18n.t('statuses::description', {
      context: rejectionReason || cancellationReason,
      comment: cancellationComments,
      cancellation_reason_comment: cancellationComments,
      rebook,
    }),
  }

  return message
}

module.exports = getMessage
