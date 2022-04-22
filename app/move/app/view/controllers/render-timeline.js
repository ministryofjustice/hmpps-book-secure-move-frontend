const presenters = require('../../../../../common/presenters')

function renderTimeline(req, res) {
  const { move = {} } = req
  const { status, cancellation_reason: cancellationReason } = move

  // TODO: remove this second call when backend returns rebook info as part of move
  if (status === 'cancelled' && cancellationReason === 'rejected') {
    const moveRejectEvent = move.timeline_events.filter(
      event => event.event_type === 'MoveReject'
    )[0]
    req.move.rebook = moveRejectEvent.details.rebook
  }

  const timeline = presenters.moveToTimelineComponent(move)

  const locals = {
    timeline,
  }

  const fullName = move.profile.person._fullname

  if (req.session.successBanner) {
    req.flash('success', {
      title: req.t('messages::events_added.heading'),
      content: req.t('messages::events_added.content', { fullName }),
    })
  }

  res.render('move/app/view/views/timeline', locals)
  delete req.session.successBanner
}

module.exports = renderTimeline
