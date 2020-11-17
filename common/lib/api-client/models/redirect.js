module.exports = {
  fields: {
    timestamp: '',
    notes: '',
    to_location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
  },
}
