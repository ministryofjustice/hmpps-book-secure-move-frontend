module.exports = {
  fields: {
    start_date: '',
    end_date: '',
    location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
    cancellation_reason: '',
    cancellation_reason_comment: '',
  },
}
