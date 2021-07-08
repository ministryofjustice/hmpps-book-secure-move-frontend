const Sentry = require('@sentry/node')
const axios = require('axios')
const rax = require('retry-axios')

const axiosInstance = axios.create()
axiosInstance.defaults.raxConfig = {
  instance: axiosInstance,
  retry: 1,
}
rax.attach(axiosInstance)

const { AUTH_PROVIDERS, NOMIS_ELITE2_API } = require('../../config')
const { decodeAccessToken } = require('../lib/access-token')

const ReferenceDataService = require('./reference-data')
const referenceDataService = new ReferenceDataService()

const getAuthHeader = token => ({ Authorization: `Bearer ${token}` })

function getFullname(token) {
  return axiosInstance
    .get(AUTH_PROVIDERS.hmpps.user_url, {
      headers: getAuthHeader(token),
    })
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
      Sentry.captureException(new Error('Unknown auth source'), {
        level: Sentry.Severity.Warning,
        tags: { authSource },
      })

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
    const supplier = await referenceDataService.getSupplierByKey(supplierKey)
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

  return axiosInstance
    .get(AUTH_PROVIDERS.hmpps.groups_url(userName), {
      headers: getAuthHeader(token),
    })
    .then(response => response.data)
    .then(data => data.map(group => group.groupCode.replace(/^PECS_/, '')))
}

async function getAuthLocations(token) {
  const { authorities = [] } = decodeAccessToken(token)

  // supplier locations are dynamic and set in app/locations/controllers.js
  if (authorities.includes('ROLE_PECS_SUPPLIER')) {
    return []
  }

  const groups = await getAuthGroups(token)

  return referenceDataService.getLocationsByNomisAgencyId(groups)
}

function getNomisLocations(token) {
  return axiosInstance
    .get(NOMIS_ELITE2_API.user_caseloads_url, {
      headers: getAuthHeader(token),
    })
    .then(response => response.data)
    .then(data => data.map(caseload => caseload.caseLoadId))
    .then(agencies =>
      referenceDataService.getLocationsByNomisAgencyId(agencies)
    )
}

module.exports = {
  getLocations,
  getFullname,
  getSupplierId,
}
