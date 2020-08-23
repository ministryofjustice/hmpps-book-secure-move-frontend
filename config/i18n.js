const i18next = require('i18next')
const Backend = require('i18next-sync-fs-backend')

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
    'dashboard',
    'default',
    'actions',
    'errors',
    'fields',
    'filters',
    'locations',
    'messages',
    'moves',
    'person-escort-record',
    'statuses',
    'validation',
  ],
  defaultNS: 'default',
  backend: {
    loadPath: './locales/{{lng}}/{{ns}}.json',
  },
})

module.exports = i18next
