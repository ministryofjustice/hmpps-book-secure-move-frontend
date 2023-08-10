module.exports = {
  fields: {
    start_date: '',
    end_date: '',
    location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
  },
}
