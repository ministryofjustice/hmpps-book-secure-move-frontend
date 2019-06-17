function defineModels (jsonApi) {
  jsonApi.define('move', {
    reference: '',
    status: '',
    updated_at: '',
    time_due: '',
    date: '',
    person: {
      jsonApi: 'hasOne',
      type: 'people',
    },
    from_location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
    to_location: {
      jsonApi: 'hasOne',
      type: 'locations',
    },
  })

  jsonApi.define('person', {
    first_names: '',
    last_name: '',
    date_of_birth: '',
    identifiers: '',
    assessment_answers: '',
    gender: {
      jsonApi: 'hasOne',
      type: 'genders',
    },
    ethnicity: {
      jsonApi: 'hasOne',
      type: 'ethnicities',
    },
  })

  jsonApi.define('gender', {
    title: '',
    description: '',
  }, {
    collectionPath: 'reference/genders',
  })

  jsonApi.define('ethnicity', {
    code: '',
    title: '',
    description: '',
  }, {
    collectionPath: 'reference/ethnicities',
  })

  jsonApi.define('assessment_question', {
    title: '',
    category: '',
    comments: '',
    nomis_alert_type: '',
    nomis_alert_code: '',
  }, {
    collectionPath: 'reference/assessment_questions',
  })

  jsonApi.define('location', {
    description: '',
    location_type: '',
    location_code: '',
  })
}

module.exports = defineModels
