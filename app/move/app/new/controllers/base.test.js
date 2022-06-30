const Sentry = require('@sentry/node')
const FormController = require('hmpo-form-wizard').Controller

const FormWizardController = require('../../../../../common/controllers/form-wizard')
const middleware = require('../../../../../common/middleware')
const personService = {
  getCategory: sinon.stub(),
}

const CreateBaseController = require('./base')

const controller = new CreateBaseController({ route: '/' })

describe('Move controllers', function () {
  describe('Create base controller', function () {
    describe('#middlewareChecks()', function () {
      beforeEach(function () {
        sinon.stub(FormController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')

        controller.middlewareChecks()
      })

      it('should call parent method', function () {
        expect(FormController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call check current location method', function () {
        expect(controller.use).to.have.been.calledWith(
          controller.checkCurrentLocation
        )
      })

      it('should call check move supported method', function () {
        expect(controller.use).to.have.been.calledWith(
          controller.checkMoveSupported
        )
      })
    })

    describe('#middlewareSetup()', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setModels')
        sinon.stub(controller, 'setProfile')

        controller.middlewareSetup()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareSetup).to.have.been
          .calledOnce
      })

      it('should call set models method', function () {
        expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
          controller.setModels
        )
      })

      it('should call set profile method', function () {
        expect(controller.use.getCall(1)).to.have.been.calledWithExactly(
          controller.setProfile
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(2)
      })
    })

    describe('#setProfile', function () {
      let mockReq, nextSpy
      const mockCreatedProfile = {
        id: '__profile__',
        person: {
          id: '__person__',
        },
      }

      beforeEach(function () {
        mockReq = {
          services: {
            profile: {
              create: sinon.stub().resolves(mockCreatedProfile),
            },
          },
          sessionModel: {
            get: sinon.stub().returns(),
            set: sinon.stub().returns({}),
          },
        }
        nextSpy = sinon.spy()
      })

      context('without person', function () {
        beforeEach(async function () {
          await controller.setProfile(mockReq, {}, nextSpy)
        })

        it('should not create a profile', function () {
          expect(mockReq.services.profile.create).not.to.have.been.called
        })

        it('should not update session data', function () {
          expect(mockReq.sessionModel.set).not.to.have.been.called
        })

        it('should call next', function () {
          expect(nextSpy).to.have.been.calledOnceWithExactly()
        })
      })

      context('with person', function () {
        const mockPerson = {
          id: 'person_12345',
        }

        beforeEach(function () {
          mockReq.sessionModel.get.withArgs('person').returns(mockPerson)
        })

        context('without existing profile', function () {
          beforeEach(async function () {
            await controller.setProfile(mockReq, {}, nextSpy)
          })

          it('should create a profile', function () {
            expect(
              mockReq.services.profile.create
            ).to.have.been.calledOnceWithExactly('person_12345', {})
          })

          it('should update session data with profile', function () {
            expect(mockReq.sessionModel.set).to.have.been.calledOnceWithExactly(
              'profile',
              mockCreatedProfile
            )
          })

          it('should call next', function () {
            expect(nextSpy).to.have.been.calledOnceWithExactly()
          })
        })

        context('with existing profile', function () {
          const mockProfile = {
            id: 'profile_12345',
          }

          beforeEach(function () {
            mockReq.sessionModel.get.withArgs('profile').returns(mockProfile)
          })

          context('with same person', function () {
            beforeEach(async function () {
              mockProfile.person = mockPerson
              await controller.setProfile(mockReq, {}, nextSpy)
            })

            it('should not create a profile', function () {
              expect(mockReq.services.profile.create).not.to.have.been.called
            })

            it('should not update session data', function () {
              expect(mockReq.sessionModel.set).not.to.have.been.called
            })

            it('should call next', function () {
              expect(nextSpy).to.have.been.calledOnceWithExactly()
            })
          })

          context('with different person', function () {
            beforeEach(async function () {
              mockProfile.person = {
                id: 'person_67890',
              }
              await controller.setProfile(mockReq, {}, nextSpy)
            })

            it('should create a profile', function () {
              expect(
                mockReq.services.profile.create
              ).to.have.been.calledOnceWithExactly('person_12345', {})
            })

            it('should update session data with profile', function () {
              expect(
                mockReq.sessionModel.set
              ).to.have.been.calledOnceWithExactly(
                'profile',
                mockCreatedProfile
              )
            })

            it('should call next', function () {
              expect(nextSpy).to.have.been.calledOnceWithExactly()
            })
          })
        })

        context('when create fails', function () {
          const mockError = new Error('Error!')

          beforeEach(async function () {
            mockReq.services.profile.create.rejects(mockError)
            await controller.setProfile(mockReq, {}, nextSpy)
          })

          it('should try to create a profile', function () {
            expect(
              mockReq.services.profile.create
            ).to.have.been.calledOnceWithExactly('person_12345', {})
          })

          it('should call next with error', function () {
            expect(nextSpy).to.have.been.calledOnceWithExactly(mockError)
          })
        })
      })
    })

    describe('#middlewareLocals()', function () {
      beforeEach(function () {
        sinon.stub(FormController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')
        sinon.stub(middleware, 'setMoveSummaryWithSessionData')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(FormController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call set button text method', function () {
        expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
          controller.setButtonText
        )
      })

      it('should call set cancel url method', function () {
        expect(controller.use.getCall(1)).to.have.been.calledWithExactly(
          controller.setCancelUrl
        )
      })

      it('should call set move summary method', function () {
        expect(controller.use.getCall(2)).to.have.been.calledWithExactly(
          middleware.setMoveSummaryWithSessionData
        )
      })

      it('should call set journey timer method', function () {
        expect(controller.use.getCall(3)).to.have.been.calledWithExactly(
          controller.setJourneyTimer
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(4)
      })
    })

    describe('#checkMoveSupported()', function () {
      let res
      let req
      let next
      let person
      let category
      beforeEach(async function () {
        personService.getCategory.resolves(category).resetHistory()
        req = {
          getPerson: sinon.stub().returns(person),
          services: {
            person: personService,
          },
          t: sinon.stub().returnsArg(0),
        }
        res = {
          render: sinon.stub(),
        }
        next = sinon.spy()
        await controller.checkMoveSupported(req, res, next)
      })

      context('when person has no prison number', function () {
        before(function () {
          person = {}
        })

        it('should not get the person’s category', function () {
          expect(personService.getCategory).to.not.be.called
        })

        it('should not render the move not supported page', function () {
          expect(res.render).to.not.be.called
        })

        it('should call next()', function () {
          expect(next).to.be.calledOnceWithExactly()
        })
      })

      context(
        'when person has a prison number and move is supported',
        function () {
          before(function () {
            person = { id: 'supported', prison_number: 'AAA' }
            category = {
              key: 'B',
              move_supported: true,
            }
          })

          it('should get the person’s category', function () {
            expect(personService.getCategory).to.be.calledOnceWithExactly(
              'supported'
            )
          })

          it('should not render the move not supported page', function () {
            expect(res.render).to.not.be.called
          })

          it('should call next()', function () {
            expect(next).to.be.calledOnceWithExactly()
          })
        }
      )

      context(
        'when person has a prison number and move is not supported',
        function () {
          before(function () {
            person = {
              id: 'unsupported',
              prison_number: 'AAA',
              _fullname: 'SMITH, JONES',
            }
            category = {
              key: 'A',
              move_supported: false,
            }
          })

          it('should get the person’s category', function () {
            expect(personService.getCategory).to.be.calledOnceWithExactly(
              'unsupported'
            )
          })

          it('should render the move not supported page', function () {
            expect(res.render).to.be.calledOnceWithExactly('action-prevented', {
              pageTitle: 'validation::move_not_supported.heading',
              message: 'validation::move_not_supported.message',
            })
          })

          it('should call translations', function () {
            expect(req.t).to.have.been.calledWithExactly(
              'validation::move_not_supported.heading',
              {
                name: person._fullname,
              }
            )
            expect(req.t).to.have.been.calledWithExactly(
              'validation::move_not_supported.message',
              {
                category: category.key,
              }
            )
          })

          it('should not call next()', function () {
            expect(next).to.not.be.called
          })
        }
      )
    })

    describe('#setButtonText()', function () {
      let req, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        req = {
          form: {
            options: {
              steps: {
                '/': {},
                '/step-one': {},
                '/last-step': {},
              },
            },
          },
          session: {},
          getMove: sinon.stub().returns({}),
          sessionModel: {
            get: sinon.stub(),
          },
        }
        sinon.stub(FormController.prototype, 'getNextStep')
      })

      context('with buttonText option', function () {
        beforeEach(function () {
          req.form.options.buttonText = 'Override button text'
          FormController.prototype.getNextStep.returns('/')

          controller.setButtonText(req, {}, nextSpy)
        })

        it('should set button text correctly', function () {
          expect(req.form.options.buttonText).to.equal('Override button text')
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with no buttonText option', function () {
        context('when step is not penultimate step', function () {
          beforeEach(function () {
            FormController.prototype.getNextStep.returns('/step-one')

            controller.setButtonText(req, {}, nextSpy)
          })

          it('should set button text correctly', function () {
            expect(req.form.options.buttonText).to.equal('actions::continue')
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('when step is penultimate step', function () {
          beforeEach(function () {
            FormController.prototype.getNextStep.returns('/last-step')
            req.sessionModel.get
              .withArgs('from_location_type')
              .returns('prison')
          })

          context('with prison transfers', function () {
            beforeEach(function () {
              req.sessionModel.get
                .withArgs('to_location_type')
                .returns('prison')

              controller.setButtonText(req, {}, nextSpy)
            })

            it('should set button text correctly', function () {
              expect(req.form.options.buttonText).to.equal(
                'actions::send_for_review'
              )
            })

            it('should call next', function () {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
          })

          context('with court appearance', function () {
            beforeEach(function () {
              req.sessionModel.get.withArgs('to_location_type').returns('court')

              controller.setButtonText(req, {}, nextSpy)
            })

            it('should set button text correctly', function () {
              expect(req.form.options.buttonText).to.equal(
                'actions::request_move'
              )
            })

            it('should call next', function () {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
          })

          context('with allocation move', function () {
            beforeEach(function () {
              req.getMove.returns({
                allocation: { id: '1' },
              })

              controller.setButtonText(req, {}, nextSpy)
            })

            it('should set button text correctly', function () {
              expect(req.form.options.buttonText).to.equal(
                'actions::add_person'
              )
            })

            it('should call next', function () {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
          })
        })
      })
    })

    describe('#setCancelUrl()', function () {
      let res, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        res = {
          locals: {},
        }
      })

      context('with no moves url local', function () {
        beforeEach(function () {
          controller.setCancelUrl({}, res, nextSpy)
        })

        it('should set cancel url correctly', function () {
          expect(res.locals).to.have.property('cancelUrl')
          expect(res.locals.cancelUrl).to.be.undefined
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with moves url local', function () {
        beforeEach(function () {
          res.locals.MOVES_URL = '/moves?move-date=2019-10-10'
          controller.setCancelUrl({}, res, nextSpy)
        })

        it('should set cancel url moves url', function () {
          expect(res.locals).to.have.property('cancelUrl')
          expect(res.locals.cancelUrl).to.equal('/moves?move-date=2019-10-10')
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#checkCurrentLocation()', function () {
      let req, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        req = {
          session: {},
        }
      })

      context('when current location exists', function () {
        beforeEach(function () {
          req.session = {
            currentLocation: {},
          }
          controller.checkCurrentLocation(req, {}, nextSpy)
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when no current location exists', function () {
        beforeEach(function () {
          controller.checkCurrentLocation(req, {}, nextSpy)
        })

        it('should call next with error', function () {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy.args[0][0]).to.be.an('error')
          expect(nextSpy.args[0][0].message).to.equal(
            'Current location is not set in session'
          )
          expect(nextSpy.args[0][0].code).to.equal('MISSING_LOCATION')
        })
      })

      context('when current location is disabled', function () {
        beforeEach(function () {
          req.session = {
            currentLocation: { disabled_at: '1999-10-10' },
          }
          controller.checkCurrentLocation(req, {}, nextSpy)
        })

        it('should call next with error', function () {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy.args[0][0]).to.be.an('error')
          expect(nextSpy.args[0][0].message).to.equal(
            'Current location is disabled'
          )
          expect(nextSpy.args[0][0].code).to.equal('DISABLED_LOCATION')
        })
      })
    })

    describe('#setModels()', function () {
      let res
      let req
      let nextSpy
      beforeEach(function () {
        res = {
          locals: {},
        }
        req = {}
        sinon.stub(controller, '_setModels')
        sinon.stub(controller, '_addModelMethods')
        nextSpy = sinon.spy()
        controller.setModels(req, res, nextSpy)
      })

      it('should set the models', function () {
        expect(req.models).to.deep.equal({})
        expect(controller._setModels).to.be.calledOnceWithExactly(req)
      })

      it('should add model methods', function () {
        expect(controller._addModelMethods).to.be.calledOnceWithExactly(req)
      })

      it('invoke next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#_setModels()', function () {
      let req
      const mockSession = {
        id: '#move',
        profile: {
          id: '#profile',
        },
        person: {
          id: '#person',
        },
      }
      beforeEach(function () {
        req = {
          models: {},
          sessionModel: {
            toJSON: sinon.stub().returns(mockSession),
            get: sinon.stub().callsFake(arg => mockSession[arg]),
          },
        }
        controller._setModels(req)
      })

      it('should add move model to req', function () {
        expect(req.models.move).to.deep.equal(mockSession)
      })

      it('should add profile model to req', function () {
        expect(req.models.profile).to.deep.equal(mockSession.profile)
      })

      it('should add person model to req', function () {
        expect(req.models.person).to.deep.equal(mockSession.person)
      })
    })

    describe('#_addModelMethods()', function () {
      let req
      beforeEach(function () {
        req = {}
        controller._addModelMethods(req)
      })

      it('should add getMove method to req', function () {
        expect(typeof req.getMove).to.equal('function')
      })

      it('should add getMoveId method to req', function () {
        expect(typeof req.getMoveId).to.equal('function')
      })

      it('should add getProfile method to req', function () {
        expect(typeof req.getProfile).to.equal('function')
      })

      it('should add getProfileId method to req', function () {
        expect(typeof req.getProfileId).to.equal('function')
      })

      it('should add getPerson method to req', function () {
        expect(typeof req.getPerson).to.equal('function')
      })

      it('should add getPersonId method to req', function () {
        expect(typeof req.getPersonId).to.equal('function')
      })
    })

    describe('#request methods', function () {
      let req

      context('when models do not exist', function () {
        beforeEach(function () {
          req = {
            models: {},
          }
          controller._addModelMethods(req)
        })

        it('req.getMove should return empty object', function () {
          expect(req.getMove()).to.deep.equal({})
        })

        it('req.getMoveId should return', function () {
          expect(req.getMoveId()).to.be.undefined
        })

        it('req.getProfile should return empty object', function () {
          expect(req.getProfile()).to.deep.equal({})
        })

        it('req.getProfileId should return', function () {
          expect(req.getProfileId()).to.be.undefined
        })

        it('req.getPerson should return empty object', function () {
          expect(req.getPerson()).to.deep.equal({})
        })

        it('req.getPersonId should return', function () {
          expect(req.getPersonId()).to.be.undefined
        })
      })

      context('when models do exist', function () {
        beforeEach(function () {
          req = {
            models: {
              move: {
                id: '#moveId',
              },
              person: {
                id: '#personId',
              },
            },
          }
          controller._addModelMethods(req)
        })

        it('req.getMove should move object', function () {
          expect(req.getMove()).to.deep.equal(req.models.move)
        })

        it('req.getMoveId should return move id', function () {
          expect(req.getMoveId()).to.equal('#moveId')
        })

        it('req.getPerson should return person object', function () {
          expect(req.getPerson()).to.deep.equal(req.models.person)
        })

        it('req.getPersonId should return person id', function () {
          expect(req.getPersonId()).to.equal('#personId')
        })
      })
    })

    describe('#setJourneyTimer()', function () {
      let req, nextSpy

      beforeEach(function () {
        this.clock = sinon.useFakeTimers(new Date('2017-08-10').getTime())
        req = {
          sessionModel: {
            get: sinon.stub(),
            set: sinon.stub(),
          },
        }
        nextSpy = sinon.spy()
      })

      afterEach(function () {
        this.clock.restore()
      })

      context('with no timestamp in the session', function () {
        beforeEach(function () {
          req.sessionModel.get.withArgs('journeyTimestamp').returns(undefined)
          controller.setJourneyTimer(req, {}, nextSpy)
        })

        it('should set timestamp', function () {
          expect(req.sessionModel.set).to.be.calledOnceWithExactly(
            'journeyTimestamp',
            1502323200000
          )
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with timestamp in the session', function () {
        const mockTimestamp = 11212121212

        beforeEach(function () {
          req.sessionModel.get
            .withArgs('journeyTimestamp')
            .returns(mockTimestamp)
          controller.setJourneyTimer(req, {}, nextSpy)
        })

        it('should not set timestamp', function () {
          expect(req.sessionModel.set).not.to.be.called
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#saveValues()', function () {
      let req, nextSpy
      const currentLocationMock = {
        id: '12345',
        location_type: 'police',
        can_upload_documents: true,
        young_offender_institution: true,
      }

      beforeEach(function () {
        sinon.stub(FormController.prototype, 'saveValues')
        req = {
          form: {
            values: {},
          },
          session: {},
        }
        nextSpy = sinon.spy()
      })

      context('with location', function () {
        beforeEach(function () {
          req.session.currentLocation = currentLocationMock
          controller.saveValues(req, {}, nextSpy)
        })

        it('should set current location ID', function () {
          expect(req.form.values.from_location).to.equal(currentLocationMock.id)
        })

        it('should set from location type', function () {
          expect(req.form.values.from_location_type).to.equal(
            currentLocationMock.location_type
          )
        })

        it('should set can upload documents values', function () {
          expect(req.form.values.can_upload_documents).to.equal(
            currentLocationMock.can_upload_documents
          )
        })

        it('should set young offender institute value', function () {
          expect(req.form.values.is_young_offender_institution).to.equal(
            currentLocationMock.young_offender_institution
          )
        })

        it('should call parent method', function () {
          expect(
            FormController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, {}, nextSpy)
        })
      })

      context('without location', function () {
        beforeEach(function () {
          controller.saveValues(req, {}, nextSpy)
        })

        it('should not set current location ID', function () {
          expect(req.form.values.from_location).to.be.undefined
        })

        it('should not set from location type', function () {
          expect(req.form.values.from_location_type).to.be.undefined
        })

        it('should not set can upload documents values', function () {
          expect(req.form.values.can_upload_documents).to.be.undefined
        })

        it('should not set young offender institute value', function () {
          expect(req.form.values.is_young_offender_institution).to.be.undefined
        })

        it('should call parent method', function () {
          expect(
            FormController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, {}, nextSpy)
        })
      })
    })

    describe('#shouldAskYouthSentenceStep', function () {
      const mockDate = new Date('2020-12-25')
      let mockReq

      beforeEach(function () {
        this.clock = sinon.useFakeTimers(mockDate.getTime())
        mockReq = {
          sessionModel: {
            get: sinon.stub(),
          },
        }
      })

      afterEach(function () {
        this.clock.restore()
      })

      context('with non-prison move', function () {
        beforeEach(function () {
          mockReq.sessionModel.get
            .withArgs('from_location_type')
            .returns('police')
        })

        it('should return false', function () {
          expect(controller.shouldAskYouthSentenceStep(mockReq)).to.be.false
        })
      })

      context('with prison move', function () {
        beforeEach(function () {
          mockReq.sessionModel.get
            .withArgs('from_location_type')
            .returns('prison')
        })

        context('without YOI', function () {
          it('should return false', function () {
            expect(controller.shouldAskYouthSentenceStep(mockReq)).to.be.false
          })
        })

        context('with YOI', function () {
          beforeEach(function () {
            mockReq.sessionModel.get
              .withArgs('is_young_offender_institution')
              .returns(true)
          })

          context('when in age bracket', function () {
            it('should return true', function () {
              mockReq.sessionModel.get
                .withArgs('person')
                .returns({ date_of_birth: '2002-10-10' })
              expect(controller.shouldAskYouthSentenceStep(mockReq)).to.be.true
            })

            it('should return true', function () {
              mockReq.sessionModel.get
                .withArgs('person')
                .returns({ date_of_birth: '2001-10-10' })
              expect(controller.shouldAskYouthSentenceStep(mockReq)).to.be.true
            })
          })

          context('when not in age bracket', function () {
            it('should return false', function () {
              mockReq.sessionModel.get
                .withArgs('person')
                .returns({ date_of_birth: '2010-10-10' })
              expect(controller.shouldAskYouthSentenceStep(mockReq)).to.be.false
            })

            it('should return false', function () {
              mockReq.sessionModel.get
                .withArgs('person')
                .returns({ date_of_birth: '1990-10-10' })
              expect(controller.shouldAskYouthSentenceStep(mockReq)).to.be.false
            })
          })
        })
      })
    })

    describe('#requiresYouthAssessment', function () {
      const mockDate = new Date('2020-12-25')
      let mockReq

      beforeEach(function () {
        this.clock = sinon.useFakeTimers(mockDate.getTime())
        mockReq = {
          sessionModel: {
            toJSON: sinon.stub(),
          },
        }
      })

      afterEach(function () {
        this.clock.restore()
      })

      context('with youth move', function () {
        it('should return true', function () {
          mockReq.sessionModel.toJSON.returns({
            person: {
              id: '12345',
            },
            from_location_type: 'secure_childrens_home',
            is_young_offender_institution: false,
          })
          expect(controller.requiresYouthAssessment(mockReq)).to.be.true
        })

        it('should return true', function () {
          mockReq.sessionModel.toJSON.returns({
            person: {
              id: '12345',
            },
            from_location_type: 'secure_training_centre',
            is_young_offender_institution: false,
          })
          expect(controller.requiresYouthAssessment(mockReq)).to.be.true
        })
      })

      context('with under 18 YOI move', function () {
        it('should return true', function () {
          mockReq.sessionModel.toJSON.returns({
            person: {
              id: '12345',
              date_of_birth: '2005-12-25',
            },
            from_location_type: 'prison',
            is_young_offender_institution: true,
          })
          expect(controller.requiresYouthAssessment(mockReq)).to.be.true
        })
      })

      context('with under 18 prison move', function () {
        it('should return false', function () {
          mockReq.sessionModel.toJSON.returns({
            person: {
              id: '12345',
              date_of_birth: '2005-12-25',
            },
            from_location_type: 'prison',
            is_young_offender_institution: false,
          })
          expect(controller.requiresYouthAssessment(mockReq)).to.be.false
        })
      })

      context('with over 18 prison move', function () {
        it('should return false', function () {
          mockReq.sessionModel.toJSON.returns({
            person: {
              id: '12345',
              date_of_birth: '1990-12-25',
            },
            from_location_type: 'prison',
            is_young_offender_institution: true,
          })
          expect(controller.requiresYouthAssessment(mockReq)).to.be.false
        })
      })

      context('with serving youth sentence move', function () {
        it('should return true', function () {
          mockReq.sessionModel.toJSON.returns({
            person: {
              id: '12345',
              date_of_birth: '2002-12-25',
            },
            from_location_type: 'prison',
            is_young_offender_institution: true,
            serving_youth_sentence: 'yes',
          })
          expect(controller.requiresYouthAssessment(mockReq)).to.be.true
        })
      })

      context('without serving youth sentence move', function () {
        it('should return false', function () {
          mockReq.sessionModel.toJSON.returns({
            person: {
              id: '12345',
              date_of_birth: '2002-12-25',
            },
            from_location_type: 'prison',
            is_young_offender_institution: true,
            serving_youth_sentence: 'no',
          })
          expect(controller.requiresYouthAssessment(mockReq)).to.be.false
        })
      })

      context('with police move', function () {
        it('should return false', function () {
          mockReq.sessionModel.toJSON.returns({
            person: {
              id: '12345',
              date_of_birth: '2005-12-25',
            },
            from_location_type: 'police',
            is_young_offender_institution: false,
          })
          expect(controller.requiresYouthAssessment(mockReq)).to.be.false
        })
      })
    })

    describe('#validateFields', function () {
      let mockReq, mockRes, nextSpy
      const errorMessage = 'PNC validation failed'
      const mockErrors = {
        foo: {
          url: '/step-url',
          key: 'foo',
          type: '#foo',
        },
        bar: {
          url: '/step-url',
          key: 'bar',
          type: '#bar',
        },
        fizz: {
          url: '/step-url',
          key: 'fizz',
          type: 'policeNationalComputerNumber',
        },
        buzz: {
          url: '/step-url',
          key: 'buzz',
          type: 'policeNationalComputerNumber',
        },
      }

      beforeEach(function () {
        sinon.stub(Sentry, 'captureException')
        sinon
          .stub(FormController.prototype, 'validateFields')
          .callsFake((req, res, callback) => {
            callback(mockErrors)
          })

        mockReq = {}
        mockRes = {}
        nextSpy = sinon.spy()

        controller.validateFields(mockReq, mockRes, nextSpy)
      })

      it('should remove keys that only need a warning', function () {
        expect(nextSpy).to.have.been.calledOnce
        expect(nextSpy.args[0][0]).to.have.all.key(['foo', 'bar'])
      })

      describe('Sentry warnings', function () {
        it('should send correct number of warnings', function () {
          expect(Sentry.captureException).to.have.been.calledTwice
        })

        it('should send warning for each field', function () {
          expect(Sentry.captureException.args[0][0]).to.be.an.instanceOf(Error)
          expect(Sentry.captureException.args[0][0].message).to.equal(
            errorMessage
          )
          expect(Sentry.captureException.args[0][1].level).to.equal('warning')

          expect(Sentry.captureException.args[1][0]).to.be.an.instanceOf(Error)
          expect(Sentry.captureException.args[1][0].message).to.equal(
            errorMessage
          )
          expect(Sentry.captureException.args[1][1].level).to.equal('warning')
        })

        it('should send correct data for filter field', function () {
          expect(Sentry.captureException.args[0][1].tags).to.deep.equal({
            'validation_error.key': 'fizz',
            'validation_error.path': '/step-url',
            'validation_error.type': 'policeNationalComputerNumber',
          })

          expect(Sentry.captureException.args[0][1].contexts).to.deep.equal({
            'Form wizard error': {
              ...mockErrors.fizz,
              validationType: 'policeNationalComputerNumber',
            },
          })
        })

        it('should send correct data for PNC field', function () {
          expect(Sentry.captureException.args[1][1].tags).to.deep.equal({
            'validation_error.key': 'buzz',
            'validation_error.path': '/step-url',
            'validation_error.type': 'policeNationalComputerNumber',
          })

          expect(Sentry.captureException.args[1][1].contexts).to.deep.equal({
            'Form wizard error': {
              ...mockErrors.buzz,
              validationType: 'policeNationalComputerNumber',
            },
          })
        })
      })
    })
  })
})
