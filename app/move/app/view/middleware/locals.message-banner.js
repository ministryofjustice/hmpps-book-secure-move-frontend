module.exports = async (req, res, next) => {
  const { move } = req

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
  }

  if (messageBanner) {
    res.locals.messageBanner = {
      ...messageBanner,
      allowDismiss: false,
      classes: 'govuk-!-padding-right-3',
    }
  }

  next()
}
