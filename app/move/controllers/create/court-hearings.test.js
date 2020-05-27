const timezoneMock = require('timezone-mock')

const presenters = require('../../../../common/presenters')
const componentService = require('../../../../common/services/component')
const personService = require('../../../../common/services/person')
const filters = require('../../../../config/nunjucks/filters')

const CreateBaseController = require('./base')
const Controller = require('./court-hearings')

const controller = new Controller({ route: '/' })

const mockPerson = {
  id: 'b695d0f0-af8e-4b97-891e-92020d6820b9',
  first_names: 'Steve Jones',
  last_name: 'Bloggs',
}
const mockCourtCases = [
  {
    id: 'T20167984',
    nomis_case_id: 'T20167984',
    nomis_case_status: 'ACTIVE',
    case_start_date: '2016-11-14',
    case_type: 'Adult',
    case_number: 'T20167984',
    location: {
      title: 'Snaresbrook Crown Court',
    },
  },
  {
    id: 'T20177984',
    nomis_case_id: 'T20177984',
    nomis_case_status: 'ACTIVE',
    case_start_date: '2018-11-14',
    case_type: 'Adult',
    case_number: 'T20177984',
    location: {
      title: 'Luton Crown Court',
    },
  },
]

describe('Move controllers', function() {
  describe('Hearing details controller', function() {
    describe('#middlewareSetup()', function() {
      beforeEach(function() {
        sinon.stub(CreateBaseController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setCourtCaseItems')

        controller.middlewareSetup()
      })

      it('should call parent method', function() {
        expect(CreateBaseController.prototype.middlewareSetup).to.have.been
          .calledOnce
      })

      it('should call setCourtCaseItems middleware', function() {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.setCourtCaseItems
        )
      })

      it('should call correct number of middleware', function() {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#setCourtCaseItems()', function() {
      let req, nextSpy

      beforeEach(function() {
        sinon.stub(personService, 'getActiveCourtCases')
        sinon.stub(componentService, 'getComponent').returnsArg(0)
        sinon.stub(presenters, 'courtCaseToCardComponent').returnsArg(0)
        req = {
          form: {
            options: {
              fields: {
                court_hearing__court_case: {
                  items: [],
                },
              },
            },
          },
          sessionModel: {
            get: sinon.stub(),
          },
        }
        nextSpy = sinon.spy()
      })

      context('without person ID', function() {
        beforeEach(async function() {
          await controller.setCourtCaseItems(req, {}, nextSpy)
        })

        it('should not person service', function() {
          expect(personService.getActiveCourtCases).not.to.be.called
        })

        it('should not set court case items', function() {
          expect(
            req.form.options.fields.court_hearing__court_case.items
          ).to.deep.equal([])
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with person ID', function() {
        beforeEach(function() {
          req.sessionModel.get.withArgs('person').returns(mockPerson)
        })

        context('when getActiveCourtCases rejects', function() {
          const mockError = new Error('Mock error')

          beforeEach(async function() {
            personService.getActiveCourtCases.rejects(mockError)
            await controller.setCourtCaseItems(req, {}, nextSpy)
          })

          it('should not set court case items', function() {
            expect(
              req.form.options.fields.court_hearing__court_case.items
            ).to.deep.equal([])
          })

          it('should call next without error', function() {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('when getActiveCourtCases resolves', function() {
          beforeEach(async function() {
            personService.getActiveCourtCases.resolves(mockCourtCases)
            await controller.setCourtCaseItems(req, {}, nextSpy)
          })

          it('should set people items property', function() {
            expect(
              req.form.options.fields.court_hearing__court_case.items
            ).to.deep.equal([
              {
                value: mockCourtCases[0].nomis_case_id,
                html: 'appCard',
              },
              {
                value: mockCourtCases[1].nomis_case_id,
                html: 'appCard',
              },
            ])
          })

          it('should call presenter correct number of times', function() {
            expect(presenters.courtCaseToCardComponent.callCount).to.equal(2)
          })

          it('should call presenter correctly', function() {
            expect(
              presenters.courtCaseToCardComponent.firstCall
            ).to.be.calledWithExactly(mockCourtCases[0])
            expect(
              presenters.courtCaseToCardComponent.secondCall
            ).to.be.calledWithExactly(mockCourtCases[1])
          })

          it('should call component service correct number of times', function() {
            expect(componentService.getComponent.callCount).to.equal(2)
          })

          it('should call component service correctly', function() {
            expect(
              componentService.getComponent.firstCall
            ).to.be.calledWithExactly('appCard', mockCourtCases[0])
            expect(
              componentService.getComponent.secondCall
            ).to.be.calledWithExactly('appCard', mockCourtCases[1])
          })

          it('should call next', function() {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })
    })

    describe('#saveValues()', function() {
      let req, nextSpy
      const mockDate = '2020-05-15'

      beforeEach(function() {
        sinon.stub(CreateBaseController.prototype, 'saveValues')
        req = {
          courtCases: mockCourtCases,
          form: {
            values: {
              court_hearing__comments: 'Hearings comments',
              court_hearing__court_case: mockCourtCases[0].id,
              court_hearing__start_time: '10:00',
            },
          },
          sessionModel: {
            get: sinon
              .stub()
              .withArgs('date')
              .returns(mockDate),
          },
        }
        nextSpy = sinon.spy()
      })

      context('when not associated with a court case', function() {
        beforeEach(function() {
          req.form.values.has_court_case = 'false'
          controller.saveValues(req, {}, nextSpy)
        })

        it('should not set court hearings', function() {
          expect(req.form.values).not.to.contain.property('court_hearings')
        })

        it('should call parent save values', function() {
          expect(
            CreateBaseController.prototype.saveValues
          ).to.have.been.calledOnceWithExactly(req, {}, nextSpy)
        })
      })

      context('when associated with a court case', function() {
        context('when court hearing service resolves', function() {
          beforeEach(function() {
            controller.saveValues(req, {}, nextSpy)
          })

          it('should add court_hearings to form values', function() {
            expect(req.form.values).to.contain.property('court_hearings')
          })

          it('should set court hearings service response to form values', function() {
            expect(req.form.values.court_hearings).to.deep.equal([
              {
                nomis_case_id: mockCourtCases[0].nomis_case_id,
                nomis_case_status: mockCourtCases[0].nomis_case_status,
                case_number: mockCourtCases[0].case_number,
                case_type: mockCourtCases[0].case_type,
                case_start_date: mockCourtCases[0].case_start_date,
                comments: req.form.values.court_hearing__comments,
                start_time: '10:00',
              },
            ])
          })

          it('should call parent save values', function() {
            expect(
              CreateBaseController.prototype.saveValues
            ).to.have.been.calledOnceWithExactly(req, {}, nextSpy)
          })
        })
      })
    })

    describe('#process()', function() {
      let mockReq, nextSpy

      beforeEach(function() {
        timezoneMock.register('UTC')
        nextSpy = sinon.spy()
        mockReq = {
          form: {
            values: {},
          },
          sessionModel: {
            get: sinon.stub().returns('2020-10-10'),
          },
        }
      })

      afterEach(function() {
        timezoneMock.unregister()
      })

      context('with start time', function() {
        context('with valid time value', function() {
          beforeEach(function() {
            mockReq.form.values.court_hearing__start_time = '10:00'
            controller.process(mockReq, {}, nextSpy)
          })

          it('should format as ISO', function() {
            expect(mockReq.form.values.court_hearing__start_time).to.equal(
              '2020-10-10T10:00:00Z'
            )
          })
        })

        context('with invalid time value', function() {
          beforeEach(function() {
            mockReq.form.values.court_hearing__start_time = 'foo'
            controller.process(mockReq, {}, nextSpy)
          })

          it('should return start time', function() {
            expect(mockReq.form.values.court_hearing__start_time).to.equal(
              'foo'
            )
          })
        })
      })

      context('without start time', function() {
        beforeEach(function() {
          mockReq.form.values.court_hearing__start_time = 'foo'
          controller.process(mockReq, {}, nextSpy)
        })

        it('should not change value', function() {
          expect(mockReq.form.values.court_hearing__start_time).to.equal('foo')
        })
      })
    })

    describe('#getValues()', function() {
      let callback
      const mockUnformattedTime = '10:00'
      const mockFormattedTime = '10pm'

      beforeEach(function() {
        callback = sinon.spy()
        sinon.stub(filters, 'formatTime').returns(mockFormattedTime)
        sinon
          .stub(CreateBaseController.prototype, 'getValues')
          .callsFake((req, res, valuesCallback) => {
            valuesCallback(null, {
              foo: 'bar',
              court_hearing__start_time: mockUnformattedTime,
            })
          })
      })

      context('when parent method does not throw an error', function() {
        beforeEach(function() {
          controller.getValues({}, {}, callback)
        })

        it('should format time', function() {
          expect(filters.formatTime).to.be.calledOnceWithExactly(
            mockUnformattedTime
          )
        })

        it('should invoke the callback', function() {
          expect(callback).to.be.calledOnceWithExactly(null, {
            foo: 'bar',
            court_hearing__start_time: mockFormattedTime,
          })
        })
      })

      context('when parent method throws an error', function() {
        const mockError = new Error()

        beforeEach(function() {
          CreateBaseController.prototype.getValues.callsFake(
            (req, res, valuesCallback) => {
              valuesCallback(mockError, {
                foo: 'bar',
              })
            }
          )
          controller.getValues({}, {}, callback)
        })

        it('should invoke the callback with the error', function() {
          expect(callback).to.be.calledOnceWithExactly(mockError)
        })
      })
    })
  })
})
