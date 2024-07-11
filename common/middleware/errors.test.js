const Sentry = require('@sentry/node')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const logger = require('../../config/logger')
const { DowntimeService } = require('../services/contentful/downtime')
class DowntimeServiceMock extends DowntimeService {
  fetchPosts(entries) {
    return Promise.resolve([])
  }
}

const errors = proxyquire('./errors', {
  '../services/contentful/downtime': {
    DowntimeService: DowntimeServiceMock,
  },
})

const errorCode404 = 404
const errorCode403 = 403
const errorCode500 = 500
const errorCode422 = 422

describe('Error middleware', function () {
  beforeEach(function () {
    sinon.stub(logger, 'info')
    sinon.stub(logger, 'error')
  })

  describe('#notFound', function () {
    let nextSpy
    const mockReq = {}

    beforeEach(function () {
      nextSpy = sinon.spy()
      errors.notFound(mockReq, null, nextSpy)
    })

    it('should set a 404 status code', function () {
      expect(nextSpy.args[0][0].statusCode).to.equal(errorCode404)
    })

    it('should call next with an error', function () {
      expect(nextSpy.calledOnce).to.be.true
      expect(nextSpy.args[0][0]).to.be.an('error')
      expect(nextSpy.args[0][0].message).to.equal('Not Found')
    })
  })

  describe('#catchAll', function () {
    let nextSpy
    let mockReq
    // const req = {}
    let mockError
    let mockRes

    beforeEach(function () {
      nextSpy = sinon.spy()
      mockError = new Error('A mock error')
      mockReq = {}
      mockRes = {
        status: sinon.stub().returnsThis(),
        render: sinon.spy(),
        locals: {},
      }
    })

    context('when headers have already been sent', function () {
      beforeEach(async function () {
        mockRes.headersSent = true
        await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
      })

      it('should call next middleware with error', function () {
        expect(nextSpy).to.have.been.calledOnce
        expect(nextSpy).to.have.been.calledWith(mockError)
      })

      it('should not render a template', function () {
        expect(nextSpy).to.have.been.calledOnce
        expect(mockRes.render).not.to.have.been.called
      })
    })

    context('when stack trace should be visible', function () {
      beforeEach(async function () {
        await errors.catchAll(true)(mockError, mockReq, mockRes, nextSpy)
      })

      it('should send showStackTrace property to template', function () {
        expect(mockRes.render.args[0][1]).to.have.property('showStackTrace')
      })

      it('should set showStackTrace to true', function () {
        expect(mockRes.render.args[0][1].showStackTrace).to.equal(true)
      })
    })

    context('when stack trace should not be visible', function () {
      beforeEach(async function () {
        await errors.catchAll(false)(mockError, mockReq, mockRes, nextSpy)
      })

      it('should send showStackTrace property to template', function () {
        expect(mockRes.render.args[0][1]).to.have.property('showStackTrace')
      })

      it('should set showStackTrace to false', function () {
        expect(mockRes.render.args[0][1].showStackTrace).to.equal(false)
      })
    })

    context('when show stack trace is not set', function () {
      beforeEach(async function () {
        await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
      })

      it('should send showStackTrace property to template', function () {
        expect(mockRes.render.args[0][1]).to.have.property('showStackTrace')
      })

      it('should set showStackTrace to false', function () {
        expect(mockRes.render.args[0][1].showStackTrace).to.equal(false)
      })
    })

    context('with a 404 error status code', function () {
      beforeEach(async function () {
        mockError.statusCode = errorCode404
        await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
      })

      it('should set correct status code on response', function () {
        expect(mockRes.status).to.have.been.calledOnce
        expect(mockRes.status).to.have.been.calledWith(errorCode404)
      })

      it('should render the error template', function () {
        expect(mockRes.render).to.have.been.calledOnce
        expect(mockRes.render.args[0][0]).to.equal('error')
      })

      it('should pass correct values to template', function () {
        expect(mockRes.render.args[0][1]).to.deep.equal({
          error: mockError,
          statusCode: errorCode404,
          showStackTrace: false,
          showNomisMessage: false,
          message: {
            heading: 'errors::not_found.heading',
            content: 'errors::not_found.content',
          },
          reference: undefined,
        })
      })

      it('should log info level message to logger', function () {
        expect(logger.info).to.have.been.calledOnce
        expect(logger.info).to.have.been.calledWith(mockError)
      })

      it('should not log error level message to logger', function () {
        expect(logger.error).not.to.have.been.called
      })

      it('should not call next', function () {
        expect(nextSpy).not.to.have.been.called
      })
    })

    context('with a standard 403 error status code', function () {
      beforeEach(async function () {
        mockError.statusCode = errorCode403
        await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
      })

      it('should set correct status code on response', function () {
        expect(mockRes.status).to.have.been.calledOnce
        expect(mockRes.status).to.have.been.calledWith(errorCode403)
      })

      it('should render the error template', function () {
        expect(mockRes.render).to.have.been.calledOnce
        expect(mockRes.render.args[0][0]).to.equal('error')
      })

      it('should pass correct values to template', function () {
        expect(mockRes.render.args[0][1]).to.deep.equal({
          error: mockError,
          statusCode: errorCode403,
          showStackTrace: false,
          showNomisMessage: false,
          message: {
            heading: 'errors::unauthorized.heading',
            content: 'errors::unauthorized.content',
          },
          reference: undefined,
        })
      })

      it('should log unauthorized message to logger error level', function () {
        expect(logger.info).to.have.been.calledOnce
        expect(logger.info).to.have.been.calledWith(mockError)
      })

      it('should not log unauthorized message to logger error level', function () {
        expect(logger.error).not.to.have.been.called
      })

      it('should not call next', function () {
        expect(nextSpy).not.to.have.been.called
      })
    })

    context('with a CSRF 403 error status code', function () {
      beforeEach(async function () {
        mockError.statusCode = errorCode403
        mockError.code = 'EBADCSRFTOKEN'
        await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
      })

      it('should set correct status code on response', function () {
        expect(mockRes.status).to.have.been.calledOnce
        expect(mockRes.status).to.have.been.calledWith(errorCode403)
      })

      it('should render the error template', function () {
        expect(mockRes.render).to.have.been.calledOnce
        expect(mockRes.render.args[0][0]).to.equal('error')
      })

      it('should pass correct values to template', function () {
        expect(mockRes.render.args[0][1]).to.deep.equal({
          error: mockError,
          statusCode: errorCode403,
          showStackTrace: false,
          showNomisMessage: false,
          message: {
            heading: 'errors::tampered_with.heading',
            content: 'errors::tampered_with.content',
          },
          reference: undefined,
        })
      })

      it('should log error level message to logger', function () {
        expect(logger.info).to.have.been.calledOnce
        expect(logger.info).to.have.been.calledWith(mockError)
      })

      it('should not log unauthorized message to logger error level', function () {
        expect(logger.error).not.to.have.been.called
      })

      it('should not call next', function () {
        expect(nextSpy).not.to.have.been.called
      })
    })

    context('with a 500 error status code', function () {
      beforeEach(function () {
        mockError.statusCode = errorCode500
      })

      context('without location', function () {
        beforeEach(async function () {
          await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
        })

        it('should set correct status code on response', function () {
          expect(mockRes.status).to.have.been.calledOnce
          expect(mockRes.status).to.have.been.calledWith(errorCode500)
        })

        it('should render the error template', function () {
          expect(mockRes.render).to.have.been.calledOnce
          expect(mockRes.render.args[0][0]).to.equal('error')
        })

        it('should pass correct values to template', function () {
          expect(mockRes.render.args[0][1]).to.deep.equal({
            error: mockError,
            statusCode: errorCode500,
            showStackTrace: false,
            showNomisMessage: false,
            message: {
              heading: 'errors::default.heading',
              content: 'errors::default.content',
            },
            reference: undefined,
          })
        })

        it('should log error level message to logger', function () {
          expect(logger.error).to.have.been.calledOnce
          expect(logger.error).to.have.been.calledWith(mockError)
        })

        it('should not log info level message to logger', function () {
          expect(logger.info).not.to.have.been.called
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.have.been.called
        })
      })

      context('with req location', function () {
        beforeEach(async function () {
          mockReq.location = {
            location_type: 'prison',
          }
          mockRes.locals.CURRENT_LOCATION = {
            location_type: 'hospital',
          }
          await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
        })

        it('should pass correct values to template', function () {
          expect(mockRes.render.args[0][1]).to.deep.equal({
            error: mockError,
            statusCode: errorCode500,
            showStackTrace: false,
            showNomisMessage: true,
            message: {
              heading: 'errors::default.heading',
              content: 'errors::default.content',
            },
            reference: undefined,
          })
        })
      })

      context('with locals location', function () {
        beforeEach(async function () {
          mockRes.locals.CURRENT_LOCATION = {
            location_type: 'prison',
          }
          await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
        })

        it('should pass correct values to template', function () {
          expect(mockRes.render.args[0][1]).to.deep.equal({
            error: mockError,
            statusCode: errorCode500,
            showStackTrace: false,
            showNomisMessage: true,
            message: {
              heading: 'errors::default.heading',
              content: 'errors::default.content',
            },
            reference: undefined,
          })
        })
      })
    })

    context('with a 422 error status code', function () {
      beforeEach(function () {
        mockError.statusCode = errorCode422
        sinon.stub(Sentry, 'captureException')
      })

      context('without location', function () {
        beforeEach(async function () {
          await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
        })

        it('should set correct status code on response', function () {
          expect(mockRes.status).to.have.been.calledOnce
          expect(mockRes.status).to.have.been.calledWith(errorCode422)
        })

        it('should render the error template', function () {
          expect(mockRes.render).to.have.been.calledOnce
          expect(mockRes.render.args[0][0]).to.equal('error')
        })

        it('should pass correct values to template', function () {
          expect(mockRes.render.args[0][1]).to.deep.equal({
            error: mockError,
            statusCode: errorCode422,
            showStackTrace: false,
            showNomisMessage: false,
            message: {
              heading: 'errors::unprocessable_entity.heading',
              content: 'errors::unprocessable_entity.content',
            },
            reference: undefined,
          })
        })

        it('should not log error level message to logger', function () {
          expect(logger.info).to.have.been.calledOnce
          expect(logger.info).to.have.been.calledWith(mockError)
        })

        it('should log info level message to logger', function () {
          expect(logger.error).not.to.have.been.called
        })
        it('should send errors to sentry', function () {
          expect(Sentry.captureException).to.have.been.calledOnce
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.have.been.called
        })
      })

      context('with req location', function () {
        beforeEach(async function () {
          mockReq.location = {
            location_type: 'prison',
          }
          mockRes.locals.CURRENT_LOCATION = {
            location_type: 'hospital',
          }
          await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
        })

        it('should pass correct values to template', function () {
          expect(mockRes.render.args[0][1]).to.deep.equal({
            error: mockError,
            statusCode: errorCode422,
            showStackTrace: false,
            showNomisMessage: false,
            message: {
              heading: 'errors::unprocessable_entity.heading',
              content: 'errors::unprocessable_entity.content',
            },
            reference: undefined,
          })
        })
      })

      context('with locals location', function () {
        beforeEach(async function () {
          mockRes.locals.CURRENT_LOCATION = {
            location_type: 'prison',
          }
          await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
        })

        it('should pass correct values to template', function () {
          expect(mockRes.render.args[0][1]).to.deep.equal({
            error: mockError,
            statusCode: errorCode422,
            showStackTrace: false,
            showNomisMessage: false,
            message: {
              heading: 'errors::unprocessable_entity.heading',
              content: 'errors::unprocessable_entity.content',
            },
            reference: undefined,
          })
        })
      })
    })

    context('with sensitive data', function () {
      beforeEach(async function () {
        mockError.config = {
          url: 'http://host.com',
          data: {
            foo: 'bar',
          },
          headers: {
            Authorization: 'Bearer ABCD1234',
            'User-Agent': 'mocha',
            'Content-Type': 'application/vnd.api+json',
          },
        }
        await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
      })

      it('should log unauthorized message to logger error level', function () {
        expect(logger.error).to.have.been.calledOnce
        expect(logger.error).to.have.been.calledWith(mockError)
      })

      it('should remove sensitive properties from error', function () {
        const thrownError = logger.error.args[0][0]

        expect(thrownError).to.be.an.instanceOf(Error)

        expect(thrownError).to.have.property('config')
        expect(thrownError.config).not.to.have.property('data')

        expect(thrownError.config).to.have.property('headers')
        expect(Object.keys(thrownError.config.headers).length).to.equal(2)
        expect(thrownError.config.headers).not.to.have.property('Authorization')
        expect(thrownError.config.headers).to.have.property('Content-Type')
        expect(thrownError.config.headers).to.have.property('User-Agent')
      })
    })

    context('with no error status code', function () {
      context('without location', function () {
        beforeEach(async function () {
          await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
        })

        it('should set correct status code on response', function () {
          expect(mockRes.status).to.have.been.calledOnce
          expect(mockRes.status).to.have.been.calledWith(errorCode500)
        })

        it('should render the error template', function () {
          expect(mockRes.render).to.have.been.calledOnce
          expect(mockRes.render.args[0][0]).to.equal('error')
        })

        it('should pass correct values to template', function () {
          expect(mockRes.render.args[0][1]).to.deep.equal({
            error: mockError,
            statusCode: errorCode500,
            showStackTrace: false,
            showNomisMessage: false,
            message: {
              heading: 'errors::default.heading',
              content: 'errors::default.content',
            },
            reference: undefined,
          })
        })

        it('should log error level message to logger', function () {
          expect(logger.error).to.have.been.calledOnce
          expect(logger.error).to.have.been.calledWith(mockError)
        })

        it('should not log info level message to logger', function () {
          expect(logger.info).not.to.have.been.called
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.have.been.called
        })
      })

      context('with req location', function () {
        beforeEach(async function () {
          mockReq.location = {
            location_type: 'prison',
          }
          mockRes.locals.CURRENT_LOCATION = {
            location_type: 'hospital',
          }
          await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
        })

        it('should pass correct values to template', function () {
          expect(mockRes.render.args[0][1]).to.deep.equal({
            error: mockError,
            statusCode: errorCode500,
            showStackTrace: false,
            showNomisMessage: true,
            message: {
              heading: 'errors::default.heading',
              content: 'errors::default.content',
            },
            reference: undefined,
          })
        })
      })

      context('with locals location', function () {
        beforeEach(async function () {
          mockRes.locals.CURRENT_LOCATION = {
            location_type: 'prison',
          }
          await errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
        })

        it('should pass correct values to template', function () {
          expect(mockRes.render.args[0][1]).to.deep.equal({
            error: mockError,
            statusCode: errorCode500,
            showStackTrace: false,
            showNomisMessage: true,
            message: {
              heading: 'errors::default.heading',
              content: 'errors::default.content',
            },
            reference: undefined,
          })
        })
      })
    })

    describe('#xhr', function () {
      let mockReq
      let mockRes

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          xhr: true,
        }
        mockRes = {
          send: sinon.spy(),
        }
        mockRes.status = sinon.stub().returns(mockRes)
        errors.catchAll()(mockError, mockReq, mockRes, nextSpy)
      })

      it('should set the correct error status', function () {
        expect(mockRes.status).to.be.calledOnce
        expect(mockRes.status.args[0][0]).to.equal(500)
      })

      it('should send the correct error message', function () {
        expect(mockRes.send).to.be.calledOnce
        expect(mockRes.send.args[0][0]).to.equal(mockError.message)
      })

      it('should not call next with an error', function () {
        expect(nextSpy).to.not.be.called
      })
    })
  })
})
