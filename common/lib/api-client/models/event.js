module.exports = {
  fields: {
    event_type: '',
    notes: '',
    classification: '',
    occurred_at: '',
    recorded_at: '',
    details: '',
    eventable: {
      jsonApi: 'hasOne',
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
