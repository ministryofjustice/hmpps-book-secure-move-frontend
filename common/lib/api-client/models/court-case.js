module.exports = {
  fields: {
    nomis_case_id: '',
    nomis_case_status: '',
    case_start_date: '',
    case_type: '',
    case_number: '',
    location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
  },
  options: {
    defaultInclude: ['location'],
  },
}
