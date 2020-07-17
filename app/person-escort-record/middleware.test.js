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
    })

    context('without framework', function () {
      beforeEach(function () {
        middleware.setFramework()(mockReq, mockRes, nextSpy)
      })

      it('should not set framework on request', function () {
        expect(mockReq.framework).to.be.undefined
      })
    })

    context('without current location', function () {
      const mockFramework = {
        sections: {
          one: 'bar',
        },
      }

      beforeEach(function () {
        middleware.setFramework(mockFramework)(mockReq, mockRes, nextSpy)
      })

      it('should set framework on request', function () {
        expect(mockReq.framework).to.deep.equal(mockFramework)
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
        middleware.setFrameworkSection()(mockReq, mockRes, nextSpy)
      })

      it('should not set framework on request', function () {
        expect(mockReq.frameworkSection).to.be.undefined
      })
    })

    context('without current location', function () {
      const mockFramework = {
        sections: {
          one: 'bar',
        },
      }

      beforeEach(function () {
        middleware.setFrameworkSection(mockFramework)(mockReq, mockRes, nextSpy)
      })

      it('should set framework on request', function () {
        expect(mockReq.frameworkSection).to.deep.equal(mockFramework)
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
          },
        }
        await middleware.setPersonEscortRecord(mockReq, {}, nextSpy)
      })

      it('should call API with record ID', function () {
        expect(personEscortRecordService.getById).to.be.calledWith(
          '__movePER__'
        )
      })

      it('should set response data to request property', function () {
        expect(mockReq).to.have.property('personEscortRecord')
        expect(mockReq.personEscortRecord).to.deep.equal(personEscortRecordStub)
      })

      it('should call next with no argument', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when no record ID exists', function () {
      beforeEach(async function () {
        await middleware.setPersonEscortRecord(mockReq, {}, nextSpy)
      })

      it('should call next with no argument', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
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
