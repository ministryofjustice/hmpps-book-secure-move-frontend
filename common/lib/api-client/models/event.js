module.exports = {
  fields: {
    event_type: '',
    notes: '',
    classification: '',
    occurred_at: '',
    created_by: '',
    recorded_at: '',
    details: '',
    eventable: {
      jsonApi: 'hasOne',
    },
    old_location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
    location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
    court_location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
    from_location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
    to_location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
    previous_move: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
    supplier: {
      jsonApi: 'hasOne',
      type: 'suppliers',
    },
  },
}
