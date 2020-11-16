module.exports = {
  fields: {
    value: '',
    value_type: '',
    responded: '',
    prefilled: '',
    person_escort_record: {
      jsonApi: 'hasOne',
      type: 'person_escort_records',
    },
    question: {
      jsonApi: 'hasOne',
      type: 'framework_questions',
    },
    flags: {
      jsonApi: 'hasMany',
      type: 'framework_flags',
    },
    nomis_mappings: {
      jsonApi: 'hasMany',
      type: 'framework_nomis_mappings',
    },
  },
  options: {
    defaultInclude: ['person_escort_record', 'question'],
  },
}
