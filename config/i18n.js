const i18next = require('i18next')
const Backend = require('i18next-sync-fs-backend')

i18next.use(Backend).init({
  backend: {
    loadPath: './locales/{{lng}}/{{ns}}.json',
  },
  defaultNS: 'default',
  fallbackLng: 'en',
  initImmediate: false,
  lng: 'en',
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
    'locations',
    'messages',
    'moves',
    'statuses',
    'validation',
  ],
  nsSeparator: '::',
  preload: ['en'],
})

module.exports = i18next
