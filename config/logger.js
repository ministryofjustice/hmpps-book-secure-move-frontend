const winston = require('winston')

const { IS_DEV, LOG_LEVEL: level } = require('./')

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
]

if (!IS_DEV) {
  // - Write to all logs with level `info` and below to `combined.log`
  // - Write all logs error (and below) to `error.log`.
  const prodFormat = winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    })
  )
  transports.push(
    new winston.transports.File({
      format: prodFormat,
      filename: 'quick-start-combined.log',
    })
  )
  transports.push(
    new winston.transports.File({
      format: prodFormat,
      filename: 'quick-start-error.log',
      level: 'error',
    })
  )
}

const logger = winston.createLogger({
  level,
  transports,
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
})

module.exports = logger
