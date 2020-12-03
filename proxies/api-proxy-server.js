const path = require('path')

const axios = require('axios')
const bodyParser = require('body-parser')
const compression = require('compression')
const express = require('express')
const morgan = require('morgan')

const { ping } = require('../app/healthcheck/controllers')
const mount = require('../common/lib/mount')
const { PROXY } = require('../config')

const { PORT, BASE_URL: API_BASE_URL } = PROXY.API

if (!API_BASE_URL) {
  throw new Error(
    'Cannot start API proxy server as no mock API_BASE_URL has been set'
  )
}

const loggingFormat = 'dev'

const app = express()
// respect query params passed such as foo[bar] rather than creating paths
app.set('query parser', 'simple')

app.use(morgan(loggingFormat))

app.use('/ping', ping)

app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }))

// construct request object for axios
app.use((req, res, next) => {
  const method = req.method

  // reconstruct passthrough url
  // const url = `${API_BASE_URL}${req.originalUrl}`
  const baseURL = API_BASE_URL
  const url = req.path

  const headers = {
    ...req.headers,
  }
  // clear headers that will definitely screw things up
  delete headers.host

  // set the request query (if any)
  const params = req.query

  // set the request payload (if any)
  const data = req.body

  const request = {
    method,
    baseURL,
    url,
    headers,
    params,
    data,
  }
  req.request = request

  next()
})

// Interceptors
app.use(mount(path.resolve(__dirname, 'interceptors')))

// Request
app.use(async (req, res, next) => {
  // skip if response already exists
  if (req.response) {
    return next()
  }

  try {
    req.response = await axios(req.request)
  } catch (error) {
    req.response = error.response
  }

  next()
})

// Transformations
app.use(mount(path.resolve(__dirname, 'transformations')))

// Response
app.use((req, res) => {
  const { response } = req

  if (response.headers) {
    // clear headers that might screw things up
    delete response.headers['transfer-encoding']

    res.set(response.headers)
  }

  res.status(response.status || 200).send(response.data)
})

app.listen(PORT, () => {
  process.stdout.write(`
API proxy server running on port ${PORT}

Fetching non-intercepted calls from
${API_BASE_URL}

`)
})
