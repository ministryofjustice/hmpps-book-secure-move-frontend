const grant = require('grant-express')
const { AUTH_PROVIDER_KEY, AUTH_PROVIDER_SECRET, OKTA_SUBDOMAIN } = require('./')

module.exports = grant({
  'defaults': {
    'protocol': 'http',
    'host': 'localhost:3000',
    'transport': 'session',
    'state': true,
  },
  'okta': {
    'key': AUTH_PROVIDER_KEY,
    'secret': AUTH_PROVIDER_SECRET,
    'scope': ['openid', 'groups', 'profile'],
    'nonce': true,
    'subdomain': OKTA_SUBDOMAIN,
    'callback': '/auth',
  },
})
