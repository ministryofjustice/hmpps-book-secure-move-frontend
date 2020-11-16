module.exports = {
  fields: {
    start_time: '',
    case_number: '',
    case_type: '',
    case_start_date: '',
    comments: '',
    nomis_case_id: '',
    nomis_hearing_id: '',
    saved_to_nomis: '',
    move: {
      jsonApi: 'hasOne',
      type: 'moves',
    },
  },
}
