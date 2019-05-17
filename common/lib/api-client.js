const JsonApi = require('devour-client')

const { API, IS_DEV } = require('../../config')

const jsonApi = new JsonApi({
  apiUrl: API.BASE_URL,
  logger: IS_DEV,
})

// Define models and relationships
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
})

jsonApi.define('location', {
  label: '',
  description: '',
  location_type: '',
})

module.exports = jsonApi
