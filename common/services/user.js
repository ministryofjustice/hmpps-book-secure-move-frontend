const axios = require('axios')

const {
  getLocationsBySupplierId,
  getLocationsByNomisAgencyId,
  getSupplierByKey,
} = require('./reference-data')
const { decodeAccessToken } = require('../lib/access-token')
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
      return getAuthLocations(token)
    case 'nomis':
      return getNomisLocations(token)
    default:
      return Promise.resolve([])
  }
}

function getAuthGroups(token) {
  const { user_name: userName } = decodeAccessToken(token)

  return axios
    .get(AUTH_PROVIDERS.hmpps.groups_url(userName), {
      headers: getAuthHeader(token),
    })
    .then(response => response.data)
    .then(data => data.map(group => group.groupCode.replace(/^PECS_/, '')))
}

function getAuthLocations(token) {
  const { authorities = [] } = decodeAccessToken(token)

  return getAuthGroups(token).then(async groups => {
    if (authorities.includes('ROLE_PECS_SUPPLIER')) {
      if (!groups.length) {
        return Promise.resolve([])
      }

      try {
        const supplierKey = groups[0].toLowerCase()
        const supplier = await getSupplierByKey(supplierKey)

        return getLocationsBySupplierId(supplier.id)
      } catch (error) {
        if (error.statusCode === 404) {
          return Promise.resolve([])
        }
        return Promise.reject(error)
      }
    }
    return getLocationsByNomisAgencyId(groups)
  })
}

function getNomisLocations(token) {
  return axios
    .get(NOMIS_ELITE2_API.user_caseloads_url, {
      headers: getAuthHeader(token),
    })
    .then(response => response.data)
    .then(data => data.map(caseload => caseload.caseLoadId))
    .then(agencies => getLocationsByNomisAgencyId(agencies))
}

module.exports = {
  getLocations,
  getFullname,
}
