const { transformResource, moveTransformer } = require('../transformers')

module.exports = {
  fields: {
    reference: '',
    status: '',
    move_type: '',
    move_agreed: '',
    move_agreed_by: '',
    rejection_reason: '',
    cancellation_reason: '',
    cancellation_reason_comment: '',
    additional_information: '',
    updated_at: '',
    created_at: '',
    time_due: '',
    date: '',
    date_from: '',
    date_to: '',
    is_lockout: '',
    is_lodging: '',
    recall_date: '',
    date_changed_reason: '',
    prison_transfer_reason: {
      jsonApi: 'hasOne',
      type: 'prison_transfer_reasons',
    },
    profile: {
      jsonApi: 'hasOne',
      type: 'profiles',
    },
    from_location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
    to_location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
    documents: {
      jsonApi: 'hasMany',
      type: 'documents',
    },
    court_hearings: {
      jsonApi: 'hasMany',
      type: 'court_hearings',
    },
    allocation: {
      jsonApi: 'hasOne',
      type: 'allocations',
    },
    original_move: {
      jsonApi: 'hasOne',
      type: 'moves',
    },
    supplier: {
      jsonApi: 'hasOne',
      type: 'suppliers',
    },
    important_events: {
      jsonApi: 'hasMany',
      type: 'events',
    },
    timeline_events: {
      jsonApi: 'hasMany',
      type: 'events',
    },
    lodgings: {
      jsonApi: 'hasMany',
      type: 'lodging',
    },
    extradition_flight: {
      jsonApi: 'hasOne',
      type: 'extradition_flight',
    },
  },
  options: {
    deserializer: transformResource(moveTransformer),
  },
}
