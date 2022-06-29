/* eslint-disable camelcase */

const compression = require('compression')
const express = require('express')
const jwt = require('jsonwebtoken')
const { find } = require('lodash')

const { decodeAccessToken } = require('../common/lib/access-token')
const {
  E2E: { USERS },
} = require('../config')

const getUserFromToken = req => {
  const token = req.headers.authorization.replace(/Bearer\s+/, '')
  const decodedToken = decodeAccessToken(token)
  return decodedToken
}

const getUserFromUsername = username => {
  return find(USERS, { username }) || {}
}

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
  const { authorities, auth_source = 'auth' } = getUserFromUsername(username)
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

  if (getUserFromUsername(username).password === password) {
    res.redirect(`${redirectUri}?state=${state}&code=${username}`)
  } else {
    res.status(401)
    res.send('Login failed')
  }
})

app.get('/auth/logout', (req, res) => {
  res.redirect(req.query.redirect_uri)
})

app.get('/auth/api/user/:USERNAME', (req, res) => {
  const username =
    req.params.USERNAME !== 'me'
      ? req.params.USERNAME
      : getUserFromToken(req).user_name
  const name = getUserFromUsername(username).name

  res.json({
    username,
    active: true,
    name,
    authSource: 'auth',
  })
})

app.get('/auth/api/authuser/:ROLE/groups', (req, res) => {
  const { user_name: username } = getUserFromToken(req)
  const { locations = [] } = getUserFromUsername(username)
  const groupCodes = locations.map(location => {
    return { groupCode: location }
  })

  res.json(groupCodes)
})

app.get('/api/users/me/caseLoads', (req, res) => {
  const { user_name: username } = getUserFromToken(req)
  const { locations = [] } = getUserFromUsername(username)
  const caseLoadIds = locations.map(location => {
    return { caseLoadId: location }
  })

  res.json(caseLoadIds)
})

app.use('*', (req, res, next) => {
  const { url, query, body } = req

  res.send(`Received ${JSON.stringify({ url, query, body }, 2, null)}`)
})

// eslint-disable-next-line no-process-env
const port = process.env.MOCK_AUTH_PORT || 3999
app.listen(port, () => {
  process.stdout.write(`Mock auth server running on port ${port}`)
})
