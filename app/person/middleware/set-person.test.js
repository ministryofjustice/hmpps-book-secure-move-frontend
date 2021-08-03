const setPerson = require('./set-person')

const personStub = { id: '12345', foo: 'bar' }
const mockPersonId = 'f6e1f57c-7d07-41d2-afee-1662f5103e2d'
const errorStub = new Error('Problem')

describe('Person app', function () {
  describe('Middleware', function () {
    describe('#setPerson()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          params: {},
          services: {
            person: {
              getById: sinon.stub().resolves(personStub),
            },
          },
        }
        res = {}
        nextSpy = sinon.spy()
      })

      context('when no person ID exists', function () {
        beforeEach(async function () {
          await setPerson(req, res, nextSpy)
        })

        it('should call next with no argument', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })

        it('should not call API with ID', function () {
          expect(req.services.person.getById).not.to.be.called
        })

        it('should not set response data to request object', function () {
          expect(req).not.to.have.property('person')
        })
      })

      context('when person ID exists', function () {
        context('when API call returns succesfully', function () {
          beforeEach(async function () {
            req.params.personId = mockPersonId
            await setPerson(req, res, nextSpy)
          })

          it('should call API with ID', function () {
            expect(req.services.person.getById).to.be.calledWith(mockPersonId)
          })

          it('should set response data to request object', function () {
            expect(req).to.have.property('person')
            expect(req.person).to.equal(personStub)
          })

          it('should call next with no argument', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('when API call returns an error', function () {
          beforeEach(async function () {
            await setPerson(
              {
                params: {
                  personId: mockPersonId,
                },
                services: {
                  person: {
                    getById: sinon.stub().throws(errorStub),
                  },
                },
              },
              res,
              nextSpy
            )
          })

          it('should not set response data to request object', function () {
            expect(req).not.to.have.property('person')
          })

          it('should send error to next function', function () {
            expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
          })
        })
      })
    })
  })
})
