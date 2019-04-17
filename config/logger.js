const { createLogger, format, transports } = require('winston')

const { IS_DEV, LOG_LEVEL } = require('./')

const logger = createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    }),
  ],
})

if (!IS_DEV) {
  // - Write to all logs with level `info` and below to `combined.log`
  // - Write all logs error (and below) to `error.log`.
  const prodFormat = format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    })
  )
  logger.add(new transports.File({
    format: prodFormat,
    filename: 'quick-start-combined.log',
  }))
  logger.add(new transports.File({
    format: prodFormat,
    filename: 'quick-start-error.log',
    level: 'error',
  }))
}

module.exports = logger
