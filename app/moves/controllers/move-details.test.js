const FormController = require('hmpo-form-wizard').Controller

const Controller = require('./move-details')
const referenceDataService = require('../../../common/services/reference-data')

const controller = new Controller({ route: '/' })
const courtsMock = [
  {
    id: '8888',
    title: 'Court 8888',
  },
  {
    id: '9999',
    title: 'Court 9999',
  },
]
const prisonsMock = [
  {
    id: '3333',
    title: 'Prison 3333',
  },
  {
    id: '4444',
    title: 'Prison 4444',
  },
]

describe('Moves controllers', function () {
  describe('Move Details', function () {
    describe('#configure()', function () {
      let nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
      })

      context('when getReferenceData returns 200', function () {
        let req

        beforeEach(async function () {
          sinon.spy(FormController.prototype, 'configure')
          sinon.stub(referenceDataService, 'getLocations').resolves(courtsMock)

          referenceDataService.getLocations.withArgs('court').resolves(courtsMock)
          referenceDataService.getLocations.withArgs('prison').resolves(prisonsMock)

          req = {
            form: {
              options: {
                fields: {
                  to_location_court: {},
                  to_location_prison: {},
                },
              },
            },
          }

          await controller.configure(req, {}, nextSpy)
        })

        it('should set list of courts dynamically', function () {
          expect(req.form.options.fields.to_location_court.items).to.deep.equal([
            { text: '--- Choose court ---' },
            { value: '8888', text: 'Court 8888' },
            { value: '9999', text: 'Court 9999' },
          ])
        })

        it('should set list of prison dynamically', function () {
          expect(req.form.options.fields.to_location_prison.items).to.deep.equal([
            { text: '--- Choose prison ---' },
            { value: '3333', text: 'Prison 3333' },
            { value: '4444', text: 'Prison 4444' },
          ])
        })

        it('should call parent configure method', function () {
          expect(FormController.prototype.configure).to.be.calledOnceWith(req, {}, nextSpy)
        })

        it('should not throw an error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when getReferenceData returns an error', function () {
        const errorMock = new Error('Problem')
        const req = {}

        beforeEach(async function () {
          sinon.stub(referenceDataService, 'getLocations').throws(errorMock)

          await controller.configure(req, {}, nextSpy)
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledOnceWith(errorMock)
        })

        it('should not mutate request object', function () {
          expect(req).to.deep.equal({})
        })
      })
    })
  })
})
