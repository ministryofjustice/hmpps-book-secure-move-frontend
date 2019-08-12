const axios = require('axios')
const { map } = require('lodash')

const { AUTH_PROVIDERS, NOMIS_ELITE2_API } = require('../../config')
const { decodeAccessToken } = require('../lib/access-token')
const referenceDataService = require('./reference-data')

function getUserLocations(token) {
  return _getAgencies(token).then(agencies =>
    referenceDataService.getLocationsByNomisAgencyId(agencies)
  )
}

function _getAgencies(token) {
  const { auth_source: source } = decodeAccessToken(token)

  switch (source) {
    case 'auth':
      return _getAuthAgencies(token)
    case 'nomis':
      return _getNomisAgencies(token)
    default:
      return Promise.resolve([])
  }
}

function _getAuthAgencies(token) {
  const tokenData = decodeAccessToken(token)

  return axios
    .get(AUTH_PROVIDERS.hmpps.groups_url(tokenData.user_name), {
      headers: _getAuthHeaders(token),
    })
    .then(response => response.data)
    .then(data => data.map(group => group.groupCode.replace(/^PECS_/, '')))
}

function _getNomisAgencies(token) {
  return axios
    .get(NOMIS_ELITE2_API.user_caseloads_url, {
      headers: _getAuthHeaders(token),
    })
    .then(response => response.data)
    .then(data => map(data, 'caseLoadId'))
}

function _getAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

module.exports = {
  getUserLocations,
}
