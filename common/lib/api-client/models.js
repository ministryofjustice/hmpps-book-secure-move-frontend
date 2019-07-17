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
    key: '',
    title: '',
    description: '',
  }, {
    collectionPath: 'reference/genders',
  })

  jsonApi.define('ethnicity', {
    key: '',
    title: '',
    description: '',
  }, {
    collectionPath: 'reference/ethnicities',
  })

  jsonApi.define('assessment_question', {
    created_at: '',
    expires_at: '',
    key: '',
    title: '',
    category: '',
    nomis_alert_type: '',
    nomis_alert_code: '',
  }, {
    collectionPath: 'reference/assessment_questions',
  })

  jsonApi.define('location', {
    key: '',
    title: '',
    location_type: '',
    location_code: '',
  }, {
    collectionPath: 'reference/locations',
  })
}

module.exports = defineModels
