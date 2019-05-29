const JsonApi = require('devour-client')

const { API, IS_DEV } = require('../../config')

const jsonApi = new JsonApi({
  apiUrl: API.BASE_URL,
  logger: IS_DEV,
})

function defineModels (jsonApi) {
  jsonApi.define('move', {
    type: '',
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
    gender: {
      jsonApi: 'hasOne',
      type: 'gender',
    },
    ethnicity: {
      jsonApi: 'hasOne',
      type: 'ethnicity',
    },
    identifiers: {
      jsonApi: 'hasMany',
      type: 'profile_identifier',
    },
    risk_alerts: {
      jsonApi: 'hasMany',
      type: 'profile_attribute',
    },
    health_alerts: {
      jsonApi: 'hasMany',
      type: 'profile_attribute',
    },
    court_information: {
      jsonApi: 'hasMany',
      type: 'profile_attribute',
    },
  })

  jsonApi.define('gender', {
    title: '',
    description: '',
  })

  jsonApi.define('ethnicity', {
    code: '',
    title: '',
    description: '',
  })

  jsonApi.define('profile_identifier', {
    value: '',
    identifier_type: '',
  })

  jsonApi.define('profile_attribute', {
    date: '',
    expiry_date: '',
    description: '',
    comments: '',
  })

  jsonApi.define('location', {
    description: '',
    location_type: '',
    location_code: '',
  })
}

defineModels(jsonApi)

// Move filter helpers
jsonApi.getMovesByDate = (moveDate) => {
  return jsonApi.findAll('move', {
    'filter[date_from]': moveDate,
    'filter[date_to]': moveDate,
  })
}

module.exports = jsonApi
