const middleware = require('./set-record')

describe('Framework middleware', function () {
  describe('#setRecord()', function () {
    const mockRecordId = '12345'
    const errorStub = new Error('Problem')
    const mockKey = 'personEscortRecord'
    const mockResource = { foo: 'bar' }
    let mockReq, nextSpy

    beforeEach(function () {
      mockReq = {
        params: {},
        services: {
          personEscortRecord: {
            getById: sinon.stub().resolves(mockResource),
          },
        },
      }
      nextSpy = sinon.spy()
    })

    context('without args', function () {
      beforeEach(async function () {
        await middleware()(mockReq, {}, nextSpy)
      })

      it('should call next with 404 error', function () {
        const error = nextSpy.args[0][0]

        expect(nextSpy).to.be.calledOnce

        expect(error).to.be.an('error')
        expect(error.message).to.equal('Resource (undefined) not found')
        expect(error.statusCode).to.equal(404)
      })

      it('should not call API with record ID', function () {
        expect(mockReq.services.personEscortRecord.getById).not.to.be.called
      })

      it('should not set request property', function () {
        expect(mockReq).not.to.have.property(mockKey)
      })
    })

    context('with existing request key', function () {
      beforeEach(async function () {
        mockReq = {
          ...mockReq,
          [mockKey]: {
            id: '__movePER__',
            status: 'not_started',
          },
        }
        await middleware(mockKey, 'personEscortRecord', 'getById')(
          mockReq,
          {},
          nextSpy
        )
      })

      it('should not call API', function () {
        expect(mockReq.services.personEscortRecord.getById).not.to.be.called
      })

      it('should set request property to existing property', function () {
        expect(mockReq).to.have.property(mockKey)
        expect(mockReq[mockKey]).to.deep.equal({
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
        await middleware(mockKey, 'personEscortRecord', 'getById')(
          mockReq,
          {},
          nextSpy
        )
      })

      it('should call next with 404 error', function () {
        const error = nextSpy.args[0][0]

        expect(nextSpy).to.be.calledOnce

        expect(error).to.be.an('error')
        expect(error.message).to.equal(`Resource (${mockKey}) not found`)
        expect(error.statusCode).to.equal(404)
      })

      it('should not call API with record ID', function () {
        expect(mockReq.services.personEscortRecord.getById).not.to.be.called
      })

      it('should not set request property', function () {
        expect(mockReq).not.to.have.property(mockKey)
      })
    })

    context('when record ID exists', function () {
      beforeEach(function () {
        mockReq.params = {
          resourceId: mockRecordId,
        }
      })

      context('when API call returns succesfully', function () {
        beforeEach(async function () {
          await middleware(mockKey, 'personEscortRecord', 'getById')(
            mockReq,
            {},
            nextSpy
          )
        })

        it('should call API with record ID', function () {
          expect(mockReq.services.personEscortRecord.getById).to.be.calledWith(
            mockRecordId
          )
        })

        it('should set response data to request property', function () {
          expect(mockReq).to.have.property(mockKey)
          expect(mockReq[mockKey]).to.deep.equal(mockResource)
        })

        it('should call next with no argument', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when API call returns an error', function () {
        beforeEach(async function () {
          mockReq.services.personEscortRecord.getById = sinon
            .stub()
            .throws(errorStub)

          await middleware(mockKey, 'personEscortRecord', 'getById')(
            mockReq,
            {},
            nextSpy
          )
        })

        it('should not set request property', function () {
          expect(mockReq).not.to.have.property(mockKey)
        })

        it('should send error to next function', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })
})
