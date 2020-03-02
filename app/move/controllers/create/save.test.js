const { capitalize, flatten, values } = require('lodash')
const proxyquire = require('proxyquire')
const FormController = require('hmpo-form-wizard').Controller

const Controller = proxyquire('./save', {
  '../../../moves': {
    mountpath: '/moves',
  },
})
const moveService = require('../../../../common/services/move')
const personService = require('../../../../common/services/person')
const analytics = require('../../../../common/lib/analytics')
const filters = require('../../../../config/nunjucks/filters')

const controller = new Controller({ route: '/' })

const mockPerson = {
  id: '3333',
  fullname: 'Full name',
}
const mockMove = {
  id: '4444',
  date: '2019-10-10',
  to_location: {
    title: 'To location',
    location_type: 'court',
  },
  from_location: {
    location_type: 'police',
  },
  person: mockPerson,
}
const valuesMock = {
  'csrf-secret': 'secret',
  errors: null,
  errorValues: {
    reference: '',
    to_location: 'Court',
    from_location: 'Prison',
  },
  reference: '',
  to_location: 'Court',
  from_location: 'Prison',
  person: {
    first_names: 'Steve',
    last_name: 'Smith',
  },
  assessment: {
    court: [
      {
        assessment_question_id: '2222',
        comments: '',
      },
    ],
    risk: [
      {
        assessment_question_id: '1111',
        comments: 'Good climber',
      },
    ],
    health: [
      {
        assessment_question_id: '4444',
        comments: 'Health issue',
      },
      {
        assessment_question_id: '3333',
        comments: '',
      },
      {
        assessment_question_id: '5555',
        comments: 'Needs bigger car',
      },
    ],
  },
}

describe('Move controllers', function() {
  describe('Save', function() {
    describe('#saveValues()', function() {
      let req, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          form: {
            values: {},
          },
          sessionModel: {
            set: sinon.stub(),
            toJSON: () => valuesMock,
          },
        }
      })

      context('when move save is successful', function() {
        beforeEach(async function() {
          sinon.spy(FormController.prototype, 'configure')
          sinon.stub(moveService, 'create').resolves(mockMove)
          sinon.stub(personService, 'update').resolves(mockPerson)
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should filter out correct properties', function() {
          expect(moveService.create).to.be.calledWith({
            reference: '',
            to_location: 'Court',
            from_location: 'Prison',
            person: {
              first_names: 'Steve',
              last_name: 'Smith',
            },
            assessment: valuesMock.assessment,
          })
        })

        it('should call person update', function() {
          expect(personService.update).to.be.calledOnceWithExactly({
            ...valuesMock.person,
            assessment_answers: flatten(values(valuesMock.assessment)),
          })
          expect(
            personService.update.args[0][0].assessment_answers.length
          ).to.equal(5)
        })

        it('should set response to session model', function() {
          expect(req.sessionModel.set).to.be.calledWith('move', mockMove)
        })

        it('should not throw an error', function() {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy).to.be.calledWith()
        })
      })

      context('when save fails', function() {
        const errorMock = new Error('Problem')

        beforeEach(async function() {
          sinon.stub(moveService, 'create').throws(errorMock)
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should call next with the error', function() {
          expect(nextSpy).to.be.calledWith(errorMock)
        })

        it('should call next once', function() {
          expect(nextSpy).to.be.calledOnce
        })

        it('should not set person response on form values', function() {
          expect(req.form.values).not.to.have.property('person')
        })
      })
    })

    describe('#successHandler()', function() {
      let req, res, nextSpy

      beforeEach(function() {
        req = {
          form: {
            values: {},
            options: {
              name: 'create-move',
            },
          },
          sessionModel: {
            get: sinon.stub(),
            reset: sinon.stub(),
          },
          journeyModel: {
            reset: sinon.stub(),
          },
        }
        res = {
          redirect: sinon.stub(),
        }
        nextSpy = sinon.stub()

        sinon.stub(filters, 'formatDateWithDay').returnsArg(0)
        sinon.stub(analytics, 'sendJourneyTime')
      })

      context('by default', function() {
        const mockJourneyTimestamp = 12345
        const mockCurrentTimestamp = new Date('2017-08-10').getTime()

        beforeEach(async function() {
          this.clock = sinon.useFakeTimers(mockCurrentTimestamp)
          analytics.sendJourneyTime.resolves({})
          req.sessionModel.get.withArgs('move').returns(mockMove)
          req.sessionModel.get
            .withArgs('journeyTimestamp')
            .returns(mockJourneyTimestamp)
          await controller.successHandler(req, res, nextSpy)
        })

        it('should send journey time to analytics', function() {
          expect(analytics.sendJourneyTime).to.be.calledOnceWithExactly({
            utv: capitalize(req.form.options.name),
            utt: mockCurrentTimestamp - mockJourneyTimestamp,
            utc: capitalize(mockMove.from_location.location_type),
          })
        })

        it('should reset the journey', function() {
          expect(req.journeyModel.reset).to.have.been.calledOnce
        })

        it('should reset the session', function() {
          expect(req.sessionModel.reset).to.have.been.calledOnce
        })

        it('should redirect correctly', function() {
          expect(res.redirect).to.have.been.calledOnce
          expect(res.redirect).to.have.been.calledWith(
            `/move/${mockMove.id}/confirmation`
          )
        })

        it('should not call next', function() {
          expect(nextSpy).not.to.have.been.called
        })
      })

      context('when send journey time fails', function() {
        const mockError = new Error('Error')

        beforeEach(async function() {
          analytics.sendJourneyTime.rejects(mockError)
          req.sessionModel.get.withArgs('move').returns(mockMove)
          req.sessionModel.get.withArgs('journeyTimestamp').returns(12345)
          await controller.successHandler(req, res, nextSpy)
        })

        it('should not redirect', function() {
          expect(res.redirect).not.to.have.been.called
        })

        it('should call next with error', function() {
          expect(nextSpy).to.have.been.calledOnceWithExactly(mockError)
        })
      })
    })
  })
})
