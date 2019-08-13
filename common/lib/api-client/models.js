function defineModels(jsonApi) {
  jsonApi.define('move', {
    reference: '',
    status: '',
    move_type: '',
    additional_information: '',
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
    gender_additional_information: '',
    gender: {
      jsonApi: 'hasOne',
      type: 'genders',
    },
    ethnicity: {
      jsonApi: 'hasOne',
      type: 'ethnicities',
    },
  })

  jsonApi.define(
    'gender',
    {
      key: '',
      title: '',
      description: '',
      nomis_code: '',
      disabled_at: '',
    },
    {
      collectionPath: 'reference/genders',
    }
  )

  jsonApi.define(
    'ethnicity',
    {
      key: '',
      title: '',
      description: '',
      nomis_code: '',
      disabled_at: '',
    },
    {
      collectionPath: 'reference/ethnicities',
    }
  )

  jsonApi.define(
    'assessment_question',
    {
      created_at: '',
      expires_at: '',
      disabled_at: '',
      key: '',
      title: '',
      category: '',
      nomis_alert_type: '',
      nomis_alert_code: '',
    },
    {
      collectionPath: 'reference/assessment_questions',
    }
  )

  jsonApi.define(
    'location',
    {
      key: '',
      title: '',
      location_type: '',
      nomis_agency_id: '',
      disabled_at: '',
    },
    {
      collectionPath: 'reference/locations',
    }
  )
}

module.exports = defineModels
