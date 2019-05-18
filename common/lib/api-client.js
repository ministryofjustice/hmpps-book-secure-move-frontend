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
  })

  jsonApi.define('location', {
    label: '',
    description: '',
    location_type: '',
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
