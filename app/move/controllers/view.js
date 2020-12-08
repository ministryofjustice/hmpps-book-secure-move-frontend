const getViewLocals = require('./view/view.locals')

module.exports = async function view(req, res) {
  const { id, status, cancellation_reason: cancellationReason } = req.move

  // TODO: remove this second call when backend returns rebook info as part of move
  if (status === 'cancelled' && cancellationReason === 'rejected') {
    const moveWithEvents = await req.services.move.getByIdWithEvents(id)
    const moveRejectEvent = moveWithEvents.timeline_events.filter(
      event => event.event_type === 'MoveReject'
    )[0]
    req.move.rebook = moveRejectEvent.details.rebook
  }

  const locals = getViewLocals(req)

  res.render('move/views/view', locals)
}
