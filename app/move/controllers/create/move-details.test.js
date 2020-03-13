const FormController = require('hmpo-form-wizard').Controller

const BaseController = require('./base')
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

describe('Move controllers', function() {
  describe('Move Details', function() {
    describe('#middlewareSetup()', function() {
      beforeEach(function() {
        sinon.stub(BaseController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setMoveType')
        sinon.stub(controller, 'setDateType')
        sinon.stub(controller, 'setLocationItems')

        controller.middlewareSetup()
      })

      it('should call parent method', function() {
        expect(BaseController.prototype.middlewareSetup).to.have.been.calledOnce
      })

      it('should call setMoveType middleware', function() {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.setMoveType
        )
      })

      it('should call setDateType middleware', function() {
        expect(controller.use.secondCall).to.have.been.calledWith(
          controller.setDateType
        )
      })

      it('should call setLocationItems middleware', function() {
        expect(controller.use.thirdCall).to.have.been.calledWith(
          controller.setLocationItems()
        )
      })

      it('should call setLocationItems middleware', function() {
        expect(controller.use.getCall(3)).to.have.been.calledWith(
          controller.setLocationItems()
        )
      })

      it('should call correct number of middleware', function() {
        expect(controller.use.callCount).to.equal(4)
      })
    })

    describe('#setDateType()', function() {
      let req, res, nextSpy

      beforeEach(function() {
        req = {
          t: sinon.stub().returns('__translated__'),
          form: {
            options: {
              fields: {
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
        nextSpy = sinon.spy()
        sinon.stub(filters, 'formatDateWithDay').returnsArg(0)

        controller.setDateType(req, res, nextSpy)
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

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#setLocationItems()', function() {
      let req, res, nextSpy

      beforeEach(function() {
        req = {
          form: {
            options: {
              fields: {
                to_location_court: {},
              },
            },
          },
        }
        res = {}
        nextSpy = sinon.spy()

        sinon.stub(referenceDataHelpers, 'filterDisabled').callsFake(() => {
          return () => true
        })
        sinon.stub(referenceDataService, 'getLocationsByType')
      })

      context('when field exists', function() {
        const mockFieldName = 'to_location_court'
        const mockLocationType = 'court'

        context('when service resolves', function() {
          beforeEach(async function() {
            referenceDataService.getLocationsByType.resolves(courtsMock)

            await controller.setLocationItems(mockLocationType, mockFieldName)(
              req,
              {},
              nextSpy
            )
          })

          it('should call reference data service', function() {
            expect(
              referenceDataService.getLocationsByType
            ).to.be.calledOnceWithExactly(mockLocationType)
          })

          it('populates the move type items', function() {
            expect(req.form.options.fields[mockFieldName].items).to.deep.equal([
              {
                text: `--- Choose ${mockLocationType} ---`,
              },
              {
                text: 'Court 8888',
                value: '8888',
              },
              {
                text: 'Court 9999',
                value: '9999',
              },
            ])
          })

          it('should call next', function() {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('when service rejects', function() {
          const errorMock = new Error('Problem')

          beforeEach(async function() {
            referenceDataService.getLocationsByType.throws(errorMock)

            await controller.setLocationItems(mockLocationType, mockFieldName)(
              req,
              {},
              nextSpy
            )
          })

          it('should call next with the error', function() {
            expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
          })

          it('should not mutate request object', function() {
            expect(req).to.deep.equal({
              form: {
                options: {
                  fields: {
                    to_location_court: {},
                  },
                },
              },
            })
          })
        })
      })

      context('when field does not exist', function() {
        beforeEach(async function() {
          await controller.setLocationItems('court', 'non_existent')(
            req,
            res,
            nextSpy
          )
        })

        it('should not call reference service', function() {
          expect(referenceDataService.getLocationsByType).not.to.be.called
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setMoveType()', function() {
      let req, res, nextSpy

      beforeEach(function() {
        req = {
          form: {
            options: {
              fields: {},
            },
          },
        }
        res = {}
        nextSpy = sinon.spy()
      })

      context('with custom move type', function() {
        beforeEach(function() {
          req.form.options.fields = {
            move_type__police: {
              foo: 'bar',
            },
          }

          controller.setMoveType(req, res, nextSpy)
        })

        it('should update the move_type field', function() {
          expect(req.form.options.fields).to.deep.equal({
            move_type: {
              foo: 'bar',
            },
          })
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('without custom move type', function() {
        beforeEach(function() {
          req.form.options.fields = {
            move_type: {
              foo: 'bar',
            },
          }

          controller.setMoveType(req, res, nextSpy)
        })

        it('should not update the move_type field', function() {
          expect(req.form.options.fields).to.deep.equal({
            move_type: {
              foo: 'bar',
            },
          })
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
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
        }
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
