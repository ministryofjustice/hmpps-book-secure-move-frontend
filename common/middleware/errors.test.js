const logger = require('../../config/logger')

const errors = require('./errors')

const errorCode404 = 404
const errorCode403 = 403
const errorCode500 = 500

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
    const req = {}
    let mockError
    let mockRes

    beforeEach(function () {
      nextSpy = sinon.spy()
      mockError = new Error('A mock error')
      mockRes = {
        status: sinon.stub().returnsThis(),
        render: sinon.spy(),
        locals: {},
      }
    })

    context('when headers have already been sent', function () {
      beforeEach(function () {
        mockRes.headersSent = true
        errors.catchAll()(mockError, req, mockRes, nextSpy)
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
      beforeEach(function () {
        errors.catchAll(true)(mockError, req, mockRes, nextSpy)
      })

      it('should send showStackTrace property to template', function () {
        expect(mockRes.render.args[0][1]).to.have.property('showStackTrace')
      })

      it('should set showStackTrace to true', function () {
        expect(mockRes.render.args[0][1].showStackTrace).to.equal(true)
      })
    })

    context('when stack trace should not be visible', function () {
      beforeEach(function () {
        errors.catchAll(false)(mockError, req, mockRes, nextSpy)
      })

      it('should send showStackTrace property to template', function () {
        expect(mockRes.render.args[0][1]).to.have.property('showStackTrace')
      })

      it('should set showStackTrace to false', function () {
        expect(mockRes.render.args[0][1].showStackTrace).to.equal(false)
      })
    })

    context('when show stack trace is not set', function () {
      beforeEach(function () {
        errors.catchAll()(mockError, req, mockRes, nextSpy)
      })

      it('should send showStackTrace property to template', function () {
        expect(mockRes.render.args[0][1]).to.have.property('showStackTrace')
      })

      it('should set showStackTrace to false', function () {
        expect(mockRes.render.args[0][1].showStackTrace).to.equal(false)
      })
    })

    context('with a 404 error status code', function () {
      beforeEach(function () {
        mockError.statusCode = errorCode404
        errors.catchAll()(mockError, req, mockRes, nextSpy)
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
      beforeEach(function () {
        mockError.statusCode = errorCode403
        errors.catchAll()(mockError, req, mockRes, nextSpy)
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
      beforeEach(function () {
        mockError.statusCode = errorCode403
        mockError.code = 'EBADCSRFTOKEN'
        errors.catchAll()(mockError, req, mockRes, nextSpy)
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
        beforeEach(function () {
          errors.catchAll()(mockError, req, mockRes, nextSpy)
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

      context('with prison location', function () {
        beforeEach(function () {
          mockRes.locals.CURRENT_LOCATION = {
            location_type: 'prison',
          }
          errors.catchAll()(mockError, req, mockRes, nextSpy)
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
          })
        })
      })
    })

    context('with no error status code', function () {
      context('without location', function () {
        beforeEach(function () {
          errors.catchAll()(mockError, req, mockRes, nextSpy)
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

      context('with prison location', function () {
        beforeEach(function () {
          mockRes.locals.CURRENT_LOCATION = {
            location_type: 'prison',
          }
          errors.catchAll()(mockError, req, mockRes, nextSpy)
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
