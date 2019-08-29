const axios = require('axios')

const { decodeAccessToken } = require('../lib/access-token')
const { getLocationsByNomisAgencyId } = require('./reference-data')
const { AUTH_PROVIDERS, NOMIS_ELITE2_API } = require('../../config')

const getAuthHeader = token => ({ Authorization: `Bearer ${token}` })

function getFullname(token) {
  return axios
    .get(AUTH_PROVIDERS.hmpps.user_url, { headers: getAuthHeader(token) })
    .then(response => response.data)
    .then(userDetails => userDetails.name)
}

function getLocations(token) {
  const { auth_source: authSource } = decodeAccessToken(token)

  switch (authSource) {
    case 'auth':
      return getAuthAgencies(token)
    case 'nomis':
      return getNomisAgencies(token)
    default:
      return Promise.resolve([])
  }
}

function getAuthAgencies(token) {
  const { user_name: userName } = decodeAccessToken(token)

  return axios
    .get(AUTH_PROVIDERS.hmpps.groups_url(userName), {
      headers: getAuthHeader(token),
    })
    .then(response => response.data)
    .then(data => data.map(group => group.groupCode.replace(/^PECS_/, '')))
    .then(agencies => getLocationsByNomisAgencyId(agencies))
}

function getNomisAgencies(token) {
  return axios
    .get(NOMIS_ELITE2_API.user_caseloads_url, {
      headers: getAuthHeader(token),
    })
    .then(response => response.data)
    .then(data => data.map(group => group.caseLoadId))
    .then(agencies => getLocationsByNomisAgencyId(agencies))
}

module.exports = {
  getLocations,
  getFullname,
}
