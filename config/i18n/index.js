const i18next = require('i18next')
const Backend = require('i18next-sync-fs-backend')

const interpolation = require('./interpolation')

i18next.use(Backend).init({
  initImmediate: false,
  lng: 'en',
  fallbackLng: 'en',
  preload: ['en'],
  nsSeparator: '::',
  ns: [
    'allocations',
    'allocation',
    'assessment',
    'collections',
    'components',
    'dashboard',
    'default',
    'actions',
    'errors',
    'events',
    'fields',
    'filters',
    'locations',
    'messages',
    'moves',
    'person-escort-record',
    'police-custody-form-errors',
    'person',
    'population',
    'statuses',
    'validation',
    'youth-risk-assessment',
  ],
  defaultNS: 'default',
  backend: {
    loadPath: './locales/{{lng}}/{{ns}}.json',
  },
  interpolation,
})

module.exports = i18next
