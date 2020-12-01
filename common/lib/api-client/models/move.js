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
    timeline_events: {
      jsonApi: 'hasMany',
      type: 'events',
    },
  },
  options: {
    defaultInclude: [
      'allocation',
      'court_hearings',
      'from_location',
      'from_location.suppliers',
      'prison_transfer_reason',
      'profile',
      'profile.documents',
      'profile.person_escort_record',
      'profile.person_escort_record.framework',
      'profile.person_escort_record.responses',
      'profile.person_escort_record.responses.question',
      'profile.person_escort_record.responses.question.descendants.**',
      'profile.person_escort_record.responses.nomis_mappings',
      'profile.person_escort_record.flags',
      'profile.person_escort_record.prefill_source',
      'profile.person',
      'profile.person.ethnicity',
      'profile.person.gender',
      'supplier',
      'to_location',
    ],
    deserializer: transformResource(moveTransformer),
  },
}
