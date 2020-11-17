const addMockValuesToEvents = (req, move) => {
  let { timeline_events: moveEvents } = move

  if (move.id === 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA') {
    if (req.query.events) {
      moveEvents = moveEvents.filter(event =>
        event.event_type.startsWith(req.query.events)
      )
    }

    const fakeValues = {
      vehicle_reg: '**AUTO_VEHICLE_REG**',
      supplier_personnel_id: '**AUTO_SUPPLIER_ID**',
      supplier_personnel_number: '**AUTO_SUPPLIER_NO**',
      cancellation_reason_comment: '**AUTO_CANCELLATION_REASON_COMMENT**',
      authorised_by: '**AUTO_AUTHORISER**',
    }

    moveEvents = moveEvents.map(event => {
      return {
        ...event,
        details: {
          ...fakeValues,
          ...event.details,
          ...req.query,
        },
      }
    })
    move.timeline_events = moveEvents
  }
}

module.exports = addMockValuesToEvents
