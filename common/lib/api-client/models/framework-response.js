module.exports = {
  fields: {
    value: '',
    value_type: '',
    responded: '',
    prefilled: '',
    assessment: {
      jsonApi: 'hasOne',
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
}
