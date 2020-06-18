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
}

module.exports = profileService
