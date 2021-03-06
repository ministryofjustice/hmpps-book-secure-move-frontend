module.exports = {
  fields: {
    assessment_answers: '',
    requires_youth_risk_assessment: '',
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
    youth_risk_assessment: {
      jsonApi: 'hasOne',
      type: 'youth_risk_assessments',
    },
    category: {
      jsonApi: 'hasOne',
      type: 'categories',
    },
  },
}
