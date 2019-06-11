const JsonApi = require('devour-client')

const { API, IS_DEV } = require('../../config')

const jsonApi = new JsonApi({
  apiUrl: API.BASE_URL,
  logger: IS_DEV,
})

function defineModels (jsonApi) {
  jsonApi.define('move', {
    reference: '',
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
    identifiers: '',
    risk_alerts: '',
    health_alerts: '',
    court_information: '',
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

  jsonApi.define('location', {
    description: '',
    location_type: '',
    location_code: '',
  })
}

defineModels(jsonApi)

module.exports = jsonApi
