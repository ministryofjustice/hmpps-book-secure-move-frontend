const moveHelpers = require('../../../common/helpers/move')
const presenters = require('../../../common/presenters')

module.exports = async function view(req, res) {
  const { move } = req
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
    ...moveHelpers.getLocals(req),
    timeline,
    urls: {
      tabs: moveHelpers.getTabsUrls(move),
    },
  }

  res.render('move/views/timeline', locals)
}
