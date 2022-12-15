import i18next from 'i18next'
import Backend from 'i18next-fs-backend'

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
    'downtime',
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

export default i18next
