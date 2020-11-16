module.exports = {
  fields: {
    key: '',
    section: '',
    options: '',
    question_type: '',
    response_type: '',
    framework: {
      jsonApi: 'hasOne',
      type: 'frameworks',
    },
    descendants: {
      jsonApi: 'hasMany',
      type: 'framework_questions',
    },
  },
}
