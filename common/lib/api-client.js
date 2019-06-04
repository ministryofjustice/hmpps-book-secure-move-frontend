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
      type: 'genders',
    },
    ethnicity: {
      jsonApi: 'hasOne',
      type: 'ethnicities',
    },
    identifiers: '',
    risk_alerts: '',
    health_alerts: '',
    court_information: '',
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

jsonApi.getMoveById = (id) => {
  return jsonApi.find('move', id)
}

module.exports = jsonApi
