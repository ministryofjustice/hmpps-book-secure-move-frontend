/* eslint-disable camelcase */

const compression = require('compression')
const express = require('express')
const jwt = require('jsonwebtoken')

const { decodeAccessToken } = require('../common/lib/access-token')
const {
  E2E: { ROLES },
} = require('../config')

const roleConfig = {
  POLICE: {
    locations: ['SRY016', 'CLP1'],
    name: 'End-to-End Test Police',
    authorities: ['ROLE_PECS_POLICE'],
  },
  PRISON: {
    locations: ['WYI'],
    name: 'End-to-End Test Prison',
    authorities: ['ROLE_PECS_PRISON'],
  },
  SCH: {
    locations: ['SCH9'],
    name: 'End-to-End Test Secure Childrens Home',
    authorities: ['ROLE_PECS_SCH'],
  },
  STC: {
    locations: ['STC3'],
    name: 'End-to-End Test STC',
    authorities: ['ROLE_PECS_STC'],
  },
  OCA: {
    locations: ['WYI'],
    name: 'End-to-end OCA',
    authorities: ['ROLE_PECS_OCA'],
  },
  PMU: {
    locations: ['BXI', 'BZI', 'NMI', 'PVI', 'TSI'],
    name: 'End-to-End Test PMU',
    authorities: ['ROLE_PECS_PMU', 'ROLE_PRISON', 'ROLE_PECS_PRISON'],
    auth_source: 'nomis',
  },
  SUPPLIER: {
    locations: ['GEOAMEY'],
    name: 'End-to-End Test Supplier',
    authorities: ['ROLE_PECS_SUPPLIER'],
  },
  PER: {
    locations: ['SRY016', 'MPS2'],
    name: 'E2E Person Escort Record',
    authorities: ['ROLE_PECS_POLICE', 'ROLE_PECS_PER_AUTHOR'],
  },
}

const users = Object.keys(ROLES).reduce((users, role) => {
  const { username, password } = ROLES[role]
  const { auth_source, locations: roleLocations } = roleConfig[role]
  const locationProperty = auth_source === 'nomis' ? 'caseLoadId' : 'groupCode'
  const locations = (roleLocations || []).map(loc => ({
    [locationProperty]: loc,
  }))
  users[username] = {
    ...roleConfig[role],
    password,
    role,
    locations,
  }
  return users
}, {})

const app = express()

app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

app.get('/auth/oauth/authorize', (req, res) => {
  res.send(`
<form action="/auth/login" method="POST">
  <h1><span class="govuk-header__logo">HMPPS Digital Services</span> - Mock OAuth Login</h1>
  <input type="hidden" name="redirect_uri" value="${req.query.redirect_uri}">
  <input type="hidden" name="state" value="${req.query.state}">
  <p>Username <input name="username" id="username"><p>
  <p>Password <input name="password" id="password" type="password"></p>
  <p><input type="submit" id="submit"></p>
</form>
  `)
})

app.post('/auth/oauth/token', (req, res) => {
  const username = req.body.code
  const { authorities, auth_source = 'auth' } = users[username]
  const token = {
    sub: username,
    user_name: username,
    scope: ['read'],
    auth_source,
    exp: 2500000000,
    authorities,
  }
  const accessToken = jwt.sign(token, 'tokenSalt', { algorithm: 'HS256' })

  res.json({ access_token: accessToken })
})

app.post('/auth/login', (req, res) => {
  const { username, password, state, redirect_uri: redirectUri } = req.body

  if (users[username].password === password) {
    res.redirect(`${redirectUri}?state=${state}&code=${username}`)
  } else {
    res.status(401)
    res.send('Login failed')
  }
})

app.get('/auth/logout', (req, res) => {
  res.redirect(req.query.redirect_uri)
})

const getUserFromToken = req => {
  const token = req.headers.authorization.replace(/Bearer\s+/, '')
  const decodedToken = decodeAccessToken(token)
  return decodedToken
}

app.get('/auth/api/user/me', (req, res) => {
  const { user_name: username } = getUserFromToken(req)
  const name = users[username].name
  res.json({
    username,
    active: true,
    name,
    authSource: 'auth',
  })
})

app.get('/auth/api/authuser/:ROLE/groups', (req, res) => {
  const { user_name: username } = getUserFromToken(req)
  const groupCodes = users[username].locations
  res.json(groupCodes)
})

app.get('/api/users/me/caseLoads', (req, res) => {
  const { user_name: username } = getUserFromToken(req)
  const caseLoadIds = users[username].locations
  res.json(caseLoadIds)
})

app.use('*', (req, res, next) => {
  const { url, query, body } = req
  res.send(`Received ${JSON.stringify({ url, query, body }, 2, null)}`)
})

app.listen(3999, () => {
  process.stdout.write('Mock auth server running on port 3999')
})
