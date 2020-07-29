const axios = require('axios')

const { AUTH_PROVIDERS, NOMIS_ELITE2_API } = require('../../config')
const { decodeAccessToken } = require('../lib/access-token')

const {
  getLocationsBySupplierId,
  getLocationsByNomisAgencyId,
  getSupplierByKey,
} = require('./reference-data')

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

async function getSupplierId(token) {
  const { authorities = [] } = decodeAccessToken(token)

  if (!authorities.includes('ROLE_PECS_SUPPLIER')) {
    return undefined
  }

  const groups = await getAuthGroups(token)

  if (groups.length === 0) {
    return undefined
  }

  const supplierKey = groups[0].toLowerCase()

  try {
    const supplier = await getSupplierByKey(supplierKey)
    return supplier.id
  } catch (error) {
    if (error.statusCode === 404) {
      return undefined
    }

    return Promise.reject(error)
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

async function getAuthLocations(token) {
  const { authorities = [] } = decodeAccessToken(token)

  const groups = await getAuthGroups(token)

  if (!authorities.includes('ROLE_PECS_SUPPLIER')) {
    return getLocationsByNomisAgencyId(groups)
  }

  if (groups.length === 0) {
    return []
  }

  try {
    const supplierKey = groups[0].toLowerCase()
    const supplier = await getSupplierByKey(supplierKey)

    return getLocationsBySupplierId(supplier.id)
  } catch (error) {
    if (error.statusCode === 404) {
      return []
    }

    return Promise.reject(error)
  }
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
  getSupplierId,
}
