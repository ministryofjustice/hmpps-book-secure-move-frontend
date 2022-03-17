module.exports = {
  fields: {
    state: '',
    billable: '',
    vehicle: '',
    timestamp: '',
    date: '',
    number: '',
    from_location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
    to_location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
  },
}
