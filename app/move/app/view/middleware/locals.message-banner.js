const { kebabCase } = require('lodash')

const assessmentToHandedOverBanner = require('../../../../../common/presenters/message-banner/assessment-to-handed-over-banner')

module.exports = async (req, res, next) => {
  const { canAccess, move } = req
  const isPERHandedOver =
    move.profile?.person_escort_record?.handover_occurred_at

  let messageBanner

  if (move.status === 'proposed') {
    messageBanner = {
      title: {
        text: req.t('messages::pending_review.heading'),
      },
      content: {
        html: req.t('messages::pending_review.content', {
          context: move.from_location.location_type,
        }),
      },
    }
  } else if (move.status === 'cancelled') {
    const {
      cancellation_reason: cancellationReason,
      cancellation_reason_comment: cancellationComments,
      rejection_reason: rejectionReason,
    } = move

    let rebookDetails

    if (cancellationReason === 'rejected') {
      try {
        const moveWithEvents = await req.services.move.getByIdWithEvents(
          move.id
        )
        const moveRejectEvent = moveWithEvents.timeline_events.filter(
          event => event.event_type === 'MoveReject'
        )[0]
        rebookDetails = moveRejectEvent.details.rebook
      } catch (error) {
        return next(error)
      }
    }

    messageBanner = {
      title: {
        text: req.t(`statuses::${move.status}`, {
          context: cancellationReason,
        }),
      },
      content: {
        html: req.t('statuses::description', {
          context: rejectionReason || cancellationReason,
          comment: cancellationComments,
          cancellation_reason_comment: cancellationComments,
          rebook: rebookDetails,
        }),
      },
    }
  } else if (isPERHandedOver) {
    const assessmentType = 'person_escort_record'

    messageBanner = assessmentToHandedOverBanner({
      assessment: move.profile[assessmentType],
      baseUrl: `/move/${move.id}/${kebabCase(assessmentType)}`,
      canAccess,
      context: assessmentType,
    })
  }

  if (messageBanner) {
    res.locals.messageBanner = {
      ...messageBanner,
      allowDismiss: false,
      classes: 'govuk-!-padding-right-0',
    }
  }

  next()
}
