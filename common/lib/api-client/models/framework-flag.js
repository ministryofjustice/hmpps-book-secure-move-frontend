module.exports = {
  fields: {
    title: '',
    flag_type: '',
    question_value: '',
    question: {
      jsonApi: 'hasOne',
      type: 'framework_questions',
    },
  },
}
