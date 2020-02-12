const FormController = require('hmpo-form-wizard').Controller

const Controller = require('./move-details')
const filters = require('../../../../config/nunjucks/filters')
const referenceDataService = require('../../../../common/services/reference-data')
const referenceDataHelpers = require('../../../../common/helpers/reference-data')

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
const mockCurrentLocation = {
  id: '5555',
  title: 'Prison 5555',
  can_upload_documents: true,
}

describe('Move controllers', function() {
  describe('Move Details', function() {
    describe('#configure()', function() {
      let nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
      })

      context('when getReferenceData returns 200', function() {
        let req, res

        beforeEach(async function() {
          sinon.spy(FormController.prototype, 'configure')
          sinon.stub(referenceDataHelpers, 'filterDisabled').callsFake(() => {
            return () => true
          })
          sinon
            .stub(referenceDataService, 'getLocationsByType')
            .withArgs('court')
            .resolves(courtsMock)
          sinon.stub(filters, 'formatDateWithDay').returnsArg(0)

          req = {
            t: sinon.stub().returns('__translated__'),
            form: {
              options: {
                fields: {
                  to_location_court_appearance: {},
                  date_type: {
                    items: [
                      {
                        text: 'fields::date_type.today',
                        value: 'today',
                      },
                      {
                        text: 'fields::date_type.tomorrow',
                        value: 'tomorrow',
                      },
                      {
                        text: 'fields::date_type.custom',
                        value: 'custom',
                      },
                    ],
                  },
                },
              },
            },
          }

          res = {
            locals: {
              TODAY: 'today',
              TOMORROW: 'tomorrow',
            },
          }

          await controller.configure(req, res, nextSpy)
        })

        it('should set list of courts dynamically', function() {
          expect(
            req.form.options.fields.to_location_court_appearance.items
          ).to.deep.equal([
            { text: '--- Choose court ---' },
            { value: '8888', text: 'Court 8888' },
            { value: '9999', text: 'Court 9999' },
          ])
        })

        it('should translate today', function() {
          expect(req.t.firstCall).to.be.calledWith('fields::date_type.today', {
            date: 'today',
          })
        })

        it('should translate tomorrow', function() {
          expect(req.t.secondCall).to.be.calledWith(
            'fields::date_type.tomorrow',
            {
              date: 'tomorrow',
            }
          )
        })

        it('should update today/tomorrow label', function() {
          expect(req.form.options.fields.date_type.items).to.deep.equal([
            { text: '__translated__', value: 'today' },
            { text: '__translated__', value: 'tomorrow' },
            { text: 'fields::date_type.custom', value: 'custom' },
          ])
        })

        it('should call parent configure method', function() {
          expect(FormController.prototype.configure).to.be.calledOnceWith(
            req,
            res,
            nextSpy
          )
        })

        it('should not throw an error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when getReferenceData returns an error', function() {
        const errorMock = new Error('Problem')
        const req = {}

        beforeEach(async function() {
          sinon.stub(referenceDataService, 'getLocations').throws(errorMock)

          await controller.configure(req, {}, nextSpy)
        })

        it('should call next with the error', function() {
          expect(nextSpy).to.be.calledOnceWith(errorMock)
        })

        it('should not mutate request object', function() {
          expect(req).to.deep.equal({})
        })
      })
    })

    describe('#process()', function() {
      let req, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          form: {
            values: {},
          },
          session: {
            currentLocation: mockCurrentLocation,
          },
        }
      })

      it('should set from location to current location from session', function() {
        controller.process(req, {}, nextSpy)
        expect(req.form.values.from_location).to.equal('5555')
      })

      it('should set from can upload documents based on current session', function() {
        controller.process(req, {}, nextSpy)
        expect(req.form.values.can_upload_documents).to.equal(true)
      })

      context('when date type is custom', function() {
        beforeEach(function() {
          req.form.values = {
            date: '',
            date_type: 'custom',
            date_custom: '2019-10-17',
          }

          controller.process(req, {}, nextSpy)
        })

        it('should set the value of date field to the custom date', function() {
          expect(req.form.values.date).to.equal('2019-10-17')
        })

        it('should store the value of custom date', function() {
          expect(req.form.values.date_custom).to.equal('2019-10-17')
        })

        it('should set date type to custom', function() {
          expect(req.form.values.date_type).to.equal('custom')
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when date type is today', function() {
        // Specifically using a DST date to ensure correct date is returned
        const mockDate = '2017-08-10'

        beforeEach(function() {
          this.clock = sinon.useFakeTimers(new Date(mockDate).getTime())
          req.form.values = {
            date: '',
            date_type: 'today',
          }

          controller.process(req, {}, nextSpy)
        })

        afterEach(function() {
          this.clock.restore()
        })

        it('should set value of date to today', function() {
          expect(req.form.values.date).to.equal(mockDate)
        })

        it('should set date type to today', function() {
          expect(req.form.values.date_type).to.equal('today')
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when date type is tomorrow', function() {
        // Specifically using a DST date to ensure correct date is returned
        const mockDate = '2017-08-10'

        beforeEach(function() {
          this.clock = sinon.useFakeTimers(new Date(mockDate).getTime())
          req.form.values = {
            date: '',
            date_type: 'tomorrow',
          }

          controller.process(req, {}, nextSpy)
        })

        it('should set value of date to tomorrow', function() {
          expect(req.form.values.date).to.equal('2017-08-11')
        })

        it('should set date type to tomorrow', function() {
          expect(req.form.values.date_type).to.equal('tomorrow')
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when location type is court', function() {
        beforeEach(function() {
          req.form.values = {
            move_type: 'court_appearance',
            to_location: '',
            to_location_court_appearance: '12345',
          }

          controller.process(req, {}, nextSpy)
        })

        it('should set to_location based on location type', function() {
          expect(req.form.values.to_location).to.equal('12345')
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when location type is prison', function() {
        beforeEach(function() {
          req.form.values = {
            move_type: 'prison_recall',
            to_location: '',
          }

          controller.process(req, {}, nextSpy)
        })

        it('should set to_location based on location type', function() {
          expect(req.form.values.to_location).to.be.undefined
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#successHandler()', function() {
      const toLocationId = '123456-7'
      const mockLocationDetail = {
        title: 'mock to location',
      }
      let req, res, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          sessionModel: {
            toJSON: sinon.stub(),
            set: sinon.spy(),
          },
        }
        res = {
          locals: {},
        }

        sinon.spy(FormController.prototype, 'successHandler')
      })

      context('with location_id', function() {
        beforeEach(async function() {
          req.sessionModel.toJSON.returns({ to_location: toLocationId })
          sinon
            .stub(referenceDataService, 'getLocationById')
            .resolves(mockLocationDetail)

          await controller.successHandler(req, res, nextSpy)
        })

        it('should set to_location in session as expected', function() {
          expect(req.sessionModel.set).to.be.calledOnceWithExactly(
            'to_location',
            mockLocationDetail
          )
        })

        it('should call parent successHandler', function() {
          expect(FormController.prototype.successHandler).to.be.calledOnceWith(
            req,
            res,
            nextSpy
          )
        })
      })

      context('without location_id', function() {
        beforeEach(async function() {
          req.sessionModel.toJSON.returns({ to_location: '' })
          sinon
            .stub(referenceDataService, 'getLocationById')
            .resolves(mockLocationDetail)

          await controller.successHandler(req, res, nextSpy)
        })

        it('should not set to_location in session', function() {
          expect(req.sessionModel.set).not.to.be.called
        })

        it('should call parent successHandler', function() {
          expect(FormController.prototype.successHandler).to.be.calledOnceWith(
            req,
            res,
            nextSpy
          )
        })
      })

      context('when getLocationById throws and error', function() {
        const errorMock = new Error('Problem')

        beforeEach(async function() {
          req.sessionModel.toJSON.returns({ to_location: toLocationId })
          sinon.stub(referenceDataService, 'getLocationById').throws(errorMock)

          await controller.successHandler(req, res, nextSpy)
        })

        it('should call next with error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
        })

        it('should not call parent successHandler', function() {
          expect(FormController.prototype.successHandler).not.to.be.called
        })
      })
    })
  })
})
