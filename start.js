const { exec } = require('child_process')
const http = require('http')

const config = require('./config')
const logger = require('./config/logger')
const app = require('./server')

const {
  PORT,
  MOCKS: {
    AUTH: { ENABLED: MOCK_AUTH_ENABLED },
  },
} = config

if (MOCK_AUTH_ENABLED) {
  process.stdout.write('Using the mock auth server\n')
  exec('pm2 start mocks/auth-server.js --watch mocks/auth-server.js -i max')
}

// eslint-disable-next-line no-process-env
process.env.TZ = 'Europe/London'

/**
 * Get port from config and store in Express.
 */
app.set('port', PORT)

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(PORT)
server.on('error', onError)
server.on('listening', onListening)

const logMessage = {
  EACCES: 'requires elevated privileges',
  EADDRINUSE: 'is already in use',
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  // handle specific listen errors with friendly messages

  if (logMessage[error.code]) {
    const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT
    logger.error(`${bind} ${logMessage[error.code]}`)
    process.exit(1)
  }

  throw error
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port

  logger.info(`Listening on ${bind}`)
}
