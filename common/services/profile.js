const { get } = require('lodash')

const apiClient = require('../lib/api-client')()

const personService = require('./person')

const profileService = {
  transform(profile) {
    if (!profile) {
      return profile
    }

    return {
      ...profile,
      person: personService.transform(profile.person),
    }
  },

  create(personId, data) {
    if (!personId) {
      return Promise.reject(new Error('No Person ID supplied'))
    }

    return apiClient
      .one('person', personId)
      .all('profile')
      .post(data)
      .then(response => response.data)
      .then(profile => profileService.transform(profile))
  },

  async update(data) {
    const personId = get(data, 'person.id')

    if (!personId) {
      return Promise.reject(new Error('No Person ID supplied'))
    }

    return apiClient
      .one('person', personId)
      .one('profile', data.id)
      .patch(data)
      .then(response => response.data)
      .then(profile => profileService.transform(profile))
  },
}

module.exports = profileService
