const Sentry = require('@sentry/node')
const axios = require('axios')
const { uniqBy } = require('lodash')
const rax = require('retry-axios')

const axiosInstance = axios.create()
axiosInstance.defaults.raxConfig = {
  instance: axiosInstance,
  retry: 1,
}
rax.attach(axiosInstance)

const fullNameCache = {}

const { AUTH_PROVIDERS, NOMIS_ELITE2_API } = require('../../config')
const { decodeAccessToken } = require('../lib/access-token')

const ReferenceDataService = require('./reference-data')
const referenceDataService = new ReferenceDataService()

const getAuthHeader = token => ({ Authorization: `Bearer ${token}` })

function getFullNameNoCache(token, username) {
  return axiosInstance
    .get(AUTH_PROVIDERS.hmpps.user_url(username), {
      headers: getAuthHeader(token),
    })
    .then(response => response.data)
    .then(userDetails => userDetails.name)
    .catch(() => undefined)
}

async function getFullName(token, username = 'me') {
  if (username === 'me') {
    return getFullNameNoCache(token, username)
  }

  if (!fullNameCache[username] || !(await fullNameCache[username])) {
    fullNameCache[username] = getFullNameNoCache(token, username)
  }

  return fullNameCache[username]
}

async function getLocations(token, supplierId, permissions) {
  const supplierLocations = await getSupplierLocations(supplierId, permissions)

  if (supplierLocations) {
    return supplierLocations
  }

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

async function getSupplierLocations(supplierId, permissions) {
  if (supplierId) {
    return await referenceDataService.getLocationsBySupplierId(supplierId)
  }

  if (permissions.includes('locations:contract_delivery_manager')) {
    const suppliers = await referenceDataService.getSuppliers()
    const supplierLocations = await Promise.all(
      suppliers.map(supplier =>
        referenceDataService.getLocationsBySupplierId(supplier.id)
      )
    )

    // The locations have been uniqued based on title to prevent
    // duplicates when multiple suppliers have the same location
    return uniqBy(supplierLocations.flat(), 'id')
  }
}

module.exports = {
  getLocations,
  getFullName,
  getSupplierId,
}
