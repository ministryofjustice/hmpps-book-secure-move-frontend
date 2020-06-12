const proxyquire = require('proxyquire').noCallThru()
const winston = require('winston')

describe('Logger', function () {
  let logger

  beforeEach(function () {
    sinon.spy(winston, 'createLogger')
  })

  context('In development environment', function () {
    beforeEach(function () {
      logger = proxyquire('./logger', {
        './': {
          IS_DEV: true,
          LOG_LEVEL: 'debug',
        },
      })
    })

    it('should create a logger', function () {
      expect(winston.createLogger).to.be.calledOnce
    })

    it('should set log level', function () {
      const config = winston.createLogger.args[0][0]

      expect(config).to.contain.property('level')
      expect(config.level).to.equal('debug')
    })

    it('should set one transport', function () {
      const config = winston.createLogger.args[0][0]

      expect(config).to.contain.property('transports')
      expect(config.transports.length).to.equal(1)
    })

    it('should export logger', function () {
      expect(logger).to.be.an('object')
      expect(logger.log).to.be.a('function')
      expect(logger.warn).to.be.a('function')
      expect(logger.error).to.be.a('function')
    })
  })

  context('In production environment', function () {
    beforeEach(function () {
      logger = proxyquire('./logger', {
        './': {
          IS_DEV: false,
          LOG_LEVEL: 'silent',
        },
      })
    })

    it('should create a logger', function () {
      expect(winston.createLogger).to.be.calledOnce
    })

    it('should set log level', function () {
      const config = winston.createLogger.args[0][0]

      expect(config).to.contain.property('level')
      expect(config.level).to.equal('silent')
    })

    it('should set three transports', function () {
      const config = winston.createLogger.args[0][0]

      expect(config).to.contain.property('transports')
      expect(config.transports.length).to.equal(3)
    })

    it('should export logger', function () {
      expect(logger).to.be.an('object')
      expect(logger.log).to.be.a('function')
      expect(logger.warn).to.be.a('function')
      expect(logger.error).to.be.a('function')
    })
  })
})
