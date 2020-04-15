const timezoneMock = require('timezone-mock')

const CreateBaseController = require('./base')
const Controller = require('./court-hearings')

const presenters = require('../../../../common/presenters')
const componentService = require('../../../../common/services/component')
const personService = require('../../../../common/services/person')
const courtHearingService = require('../../../../common/services/court-hearing')

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
        sinon.stub(personService, 'getCourtCases')
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
          expect(personService.getCourtCases).not.to.be.called
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

        context('when getCourtCases rejects', function() {
          const mockError = new Error('Mock error')

          beforeEach(async function() {
            personService.getCourtCases.rejects(mockError)
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

        context('when getCourtCases resolves', function() {
          beforeEach(async function() {
            personService.getCourtCases.resolves(mockCourtCases)
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
        timezoneMock.register('UTC')
        sinon.stub(courtHearingService, 'create')
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

      afterEach(function() {
        timezoneMock.unregister()
      })

      context('when not associated with a court case', function() {
        beforeEach(async function() {
          req.form.values.has_court_case = 'false'
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should not set court hearings', function() {
          expect(req.form.values).not.to.contain.property('court_hearings')
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when associated with a court case', function() {
        context('when court hearing service rejects', function() {
          const mockError = new Error('Mock error')

          beforeEach(async function() {
            courtHearingService.create.rejects(mockError)
            await controller.saveValues(req, {}, nextSpy)
          })

          it('should not set court hearings', function() {
            expect(req.form.values).not.to.contain.property('court_hearings')
          })

          it('should call next with error', function() {
            expect(nextSpy).to.be.calledOnceWithExactly(mockError)
          })
        })

        context('when court hearing service resolves', function() {
          const mockResponse = {
            id: 'ea7dfa93-b0d9-491f-8d18-0c5f32a08eeb',
            type: 'court_hearings',
          }

          beforeEach(async function() {
            courtHearingService.create.resolves(mockResponse)
            await controller.saveValues(req, {}, nextSpy)
          })

          it('should send correct data to court hearings service', function() {
            expect(courtHearingService.create).to.be.calledOnceWithExactly({
              nomis_case_id: mockCourtCases[0].nomis_case_id,
              nomis_case_status: mockCourtCases[0].nomis_case_status,
              case_number: mockCourtCases[0].case_number,
              case_type: mockCourtCases[0].case_type,
              case_start_date: mockCourtCases[0].case_start_date,
              comments: req.form.values.court_hearing__comments,
              start_time: '2020-05-15T10:00:00Z',
            })
          })

          it('should add court_hearings to form values', function() {
            expect(req.form.values).to.contain.property('court_hearings')
          })

          it('should set court hearings service response to form values', function() {
            expect(req.form.values.court_hearings).to.deep.equal([mockResponse])
          })
        })
      })
    })
  })

  describe('#canAccessCourtHearings()', function() {
    let req

    beforeEach(function() {
      req = {
        sessionModel: {
          get: sinon.stub(),
        },
      }
    })

    context('when feature is enabled', function() {
      const isEnabled = true

      context('when from location type is prison', function() {
        beforeEach(function() {
          req.sessionModel.get.withArgs('from_location_type').returns('prison')
        })

        it('should return true', function() {
          expect(controller.canAccessCourtHearings(isEnabled)(req)).to.be.true
        })
      })

      context('when from location type is not a prison', function() {
        beforeEach(function() {
          req.sessionModel.get.withArgs('from_location_type').returns('police')
        })

        it('should return false', function() {
          expect(controller.canAccessCourtHearings(isEnabled)(req)).to.be.false
        })
      })
    })

    context('when feature is not enabled', function() {
      const isEnabled = false

      context('when from location type is prison', function() {
        beforeEach(function() {
          req.sessionModel.get.withArgs('from_location_type').returns('prison')
        })

        it('should return false', function() {
          expect(controller.canAccessCourtHearings(isEnabled)(req)).to.be.false
        })
      })

      context('when from location type is not a prison', function() {
        beforeEach(function() {
          req.sessionModel.get.withArgs('from_location_type').returns('police')
        })

        it('should return false', function() {
          expect(controller.canAccessCourtHearings(isEnabled)(req)).to.be.false
        })
      })
    })
  })
})
