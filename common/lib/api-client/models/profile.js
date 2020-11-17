module.exports = {
  fields: {
    assessment_answers: '',
    person: {
      jsonApi: 'hasOne',
      type: 'people',
    },
    documents: {
      jsonApi: 'hasMany',
      type: 'documents',
    },
    person_escort_record: {
      jsonApi: 'hasOne',
      type: 'person_escort_records',
    },
  },
  options: {
    defaultInclude: ['person', 'documents'],
  },
}
