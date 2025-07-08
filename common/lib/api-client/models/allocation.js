module.exports = {
  fields: {
    from_location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
    to_location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
    estate: '',
    estate_comment: '',
    date: '',
    date_changed_reason: '',
    prisoner_category: '',
    sentence_length: '',
    sentence_length_comment: '',
    complex_cases: [],
    moves_count: 0,
    complete_in_full: false, // boolean
    other_criteria: '',
    created_at: '',
    updated_at: '',
    status: '',
    cancellation_reason: '',
    cancellation_reason_comment: '',
    requested_by: '',
    moves: {
      jsonApi: 'hasMany',
      type: 'moves',
    },
  },
}
