module.exports = {
  fields: {
    start_time: '',
    nomis_type: '',
    reason: '',
    location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
  },
  options: {
    collectionPath: 'timetable',
    defaultInclude: ['location'],
  },
}
