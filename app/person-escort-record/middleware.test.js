const personEscortRecordService = require('../../common/services/person-escort-record')

const middleware = require('./middleware')

const personEscortRecordStub = { foo: 'bar' }

describe('Person escort record middleware', function () {
  describe('#setAssessment()', function () {
    let mockReq, nextSpy

    beforeEach(function () {
      mockReq = {
        personEscortRecord: {
          id: '__movePER__',
          status: 'not_started',
        },
      }
      nextSpy = sinon.spy()

      middleware.setAssessment(mockReq, {}, nextSpy)
    })

    it('should set request property to existing property', function () {
      expect(mockReq).to.have.property('assessment')
      expect(mockReq.assessment).to.deep.equal({
        id: '__movePER__',
        status: 'not_started',
      })
    })

    it('should call next with no argument', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
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
