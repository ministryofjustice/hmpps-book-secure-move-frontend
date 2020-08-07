const frameworksService = require('../../common/services/frameworks')
const personEscortRecordService = require('../../common/services/person-escort-record')

const middleware = require('./middleware')

const personEscortRecordStub = { foo: 'bar' }

describe('Person escort record middleware', function () {
  describe('#setFramework()', function () {
    let mockRes, mockReq, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      mockRes = {}
      mockReq = {
        params: {},
      }
      sinon.stub(frameworksService, 'getPersonEscortRecord')
    })

    context('without Person Escort Record', function () {
      beforeEach(function () {
        middleware.setFramework(mockReq, mockRes, nextSpy)
      })

      it('should not set framework on request', function () {
        expect(mockReq.framework).to.be.undefined
      })

      it('should call next', function () {
        expect(nextSpy).to.be.called.calledOnceWithExactly()
      })
    })

    context('with Person Escort Record', function () {
      beforeEach(function () {
        mockReq.personEscortRecord = {
          version: '1.0.1',
        }
      })

      context('without framework', function () {
        const mockError = new Error('No framework')

        beforeEach(function () {
          frameworksService.getPersonEscortRecord.throws(mockError)
          middleware.setFramework(mockReq, mockRes, nextSpy)
        })

        it('should not set framework on request', function () {
          expect(mockReq.framework).to.be.undefined
        })

        it('calls next with error', function () {
          expect(nextSpy).to.have.been.calledOnceWithExactly(mockError)
        })
      })

      context('with framework', function () {
        const mockFramework = {
          sections: {
            one: 'bar',
          },
        }

        beforeEach(function () {
          frameworksService.getPersonEscortRecord.returns(mockFramework)
          middleware.setFramework(mockReq, mockRes, nextSpy)
        })

        it('should ask for correct version', function () {
          expect(
            frameworksService.getPersonEscortRecord
          ).to.be.calledOnceWithExactly('1.0.1')
        })

        it('should set framework on request', function () {
          expect(mockReq.framework).to.deep.equal(mockFramework)
        })

        it('should call next', function () {
          expect(nextSpy).to.be.called.calledOnceWithExactly()
        })
      })
    })
  })

  describe('#setFrameworkSection()', function () {
    let mockRes, mockReq, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      mockRes = {}
      mockReq = {
        params: {},
      }
    })

    context('without framework', function () {
      beforeEach(function () {
        middleware.setFrameworkSection(mockReq, mockRes, nextSpy)
      })

      it('should not set framework on request', function () {
        expect(mockReq.frameworkSection).to.be.undefined
      })

      it('should call next with 404 error', function () {
        const error = nextSpy.args[0][0]

        expect(nextSpy).to.be.calledOnce

        expect(error).to.be.an('error')
        expect(error.message).to.equal('Framework section not found')
        expect(error.statusCode).to.equal(404)
      })
    })

    context('with framework', function () {
      beforeEach(function () {
        mockReq.framework = {
          sections: {
            foo: {
              name: 'bar',
            },
          },
        }
      })

      context('with section', function () {
        beforeEach(function () {
          middleware.setFrameworkSection(mockReq, mockRes, nextSpy, 'foo')
        })

        it('should set framework on request', function () {
          expect(mockReq.frameworkSection).to.deep.equal({
            name: 'bar',
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.called.calledOnceWithExactly()
        })
      })

      context('without section', function () {
        beforeEach(function () {
          middleware.setFrameworkSection(mockReq, mockRes, nextSpy, 'bar')
        })

        it('should not set framework on request', function () {
          expect(mockReq.frameworkSection).to.be.undefined
        })

        it('should call next with 404 error', function () {
          const error = nextSpy.args[0][0]

          expect(nextSpy).to.be.calledOnce

          expect(error).to.be.an('error')
          expect(error.message).to.equal('Framework section not found')
          expect(error.statusCode).to.equal(404)
        })
      })
    })
  })

  describe('#setPersonEscortRecord()', function () {
    const mockRecordId = '12345'
    const errorStub = new Error('Problem')
    let mockReq, nextSpy

    beforeEach(function () {
      mockReq = {
        params: {},
      }
      nextSpy = sinon.spy()

      sinon
        .stub(personEscortRecordService, 'getById')
        .resolves(personEscortRecordStub)
    })

    context('with existing `req.personEscortRecord`', function () {
      beforeEach(async function () {
        mockReq = {
          ...mockReq,
          personEscortRecord: {
            id: '__movePER__',
            status: 'not_started',
          },
        }
        await middleware.setPersonEscortRecord(mockReq, {}, nextSpy)
      })

      it('should not call API', function () {
        expect(personEscortRecordService.getById).not.to.be.called
      })

      it('should set request property to existing property', function () {
        expect(mockReq).to.have.property('personEscortRecord')
        expect(mockReq.personEscortRecord).to.deep.equal({
          id: '__movePER__',
          status: 'not_started',
        })
      })

      it('should call next with no argument', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when no record ID exists', function () {
      beforeEach(async function () {
        await middleware.setPersonEscortRecord(mockReq, {}, nextSpy)
      })

      it('should call next with 404 error', function () {
        const error = nextSpy.args[0][0]

        expect(nextSpy).to.be.calledOnce

        expect(error).to.be.an('error')
        expect(error.message).to.equal('Person Escort Record not found')
        expect(error.statusCode).to.equal(404)
      })

      it('should not call API with record ID', function () {
        expect(personEscortRecordService.getById).not.to.be.called
      })

      it('should not set request property', function () {
        expect(mockReq).not.to.have.property('personEscortRecord')
      })
    })

    context('when record ID exists', function () {
      beforeEach(async function () {
        mockReq.params = {
          personEscortRecordId: mockRecordId,
        }
      })

      context('when API call returns succesfully', function () {
        beforeEach(async function () {
          await middleware.setPersonEscortRecord(mockReq, {}, nextSpy)
        })

        it('should call API with record ID', function () {
          expect(personEscortRecordService.getById).to.be.calledWith(
            mockRecordId
          )
        })

        it('should set response data to request property', function () {
          expect(mockReq).to.have.property('personEscortRecord')
          expect(mockReq.personEscortRecord).to.deep.equal(
            personEscortRecordStub
          )
        })

        it('should call next with no argument', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when API call returns an error', function () {
        beforeEach(async function () {
          personEscortRecordService.getById.throws(errorStub)

          await middleware.setPersonEscortRecord(mockReq, {}, nextSpy)
        })

        it('should not set request property', function () {
          expect(mockReq).not.to.have.property('personEscortRecord')
        })

        it('should send error to next function', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })
})
