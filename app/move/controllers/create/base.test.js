const FormController = require('hmpo-form-wizard').Controller

const FormWizardController = require('../../../../common/controllers/form-wizard')
const presenters = require('../../../../common/presenters')
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

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(1)
      })
    })

    describe('#middlewareLocals()', function () {
      beforeEach(function () {
        sinon.stub(FormController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')

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
          controller.setMoveSummary
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
            person = { id: 'unsupported', prison_number: 'AAA' }
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
            expect(res.render).to.be.calledOnceWithExactly(
              'move/views/create/move-not-supported',
              {
                person,
                category,
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

    describe('#setMoveSummary()', function () {
      let req, res, nextSpy
      const mockSessionModel = {
        date: '2019-06-09',
        time_due: '2000-01-01T14:00:00Z',
        to_location: {
          title: 'Mock to location',
        },
        additional_information: 'Additional information',
        person: {
          first_names: 'Mr',
          _fullname: 'Benn, Mr',
          last_name: 'Benn',
        },
      }

      beforeEach(function () {
        sinon.stub(presenters, 'moveToMetaListComponent').returnsArg(0)
        nextSpy = sinon.spy()
        req = {
          getMove: sinon.stub().returns(mockSessionModel),
          getPerson: sinon.stub().returns(mockSessionModel.person),
          session: {
            currentLocation: {
              title: 'Mock current location',
            },
          },
        }
        res = {
          locals: {
            existing_key: 'foo',
          },
        }
      })

      context('with move_type', function () {
        beforeEach(function () {
          req.getMove.returns({
            ...mockSessionModel,
            move_type: 'court_appearance',
          })

          controller.setMoveSummary(req, res, nextSpy)
        })

        it('should call presenter correctly', function () {
          expect(
            presenters.moveToMetaListComponent
          ).to.be.calledOnceWithExactly({
            ...mockSessionModel,
            move_type: 'court_appearance',
            from_location: {
              title: 'Mock current location',
            },
          })
        })

        it('should set locals as expected', function () {
          expect(res.locals).to.deep.equal({
            existing_key: 'foo',
            person: mockSessionModel.person,
            moveSummary: {
              ...mockSessionModel,
              move_type: 'court_appearance',
              from_location: {
                title: 'Mock current location',
              },
            },
          })
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('without move_type', function () {
        beforeEach(function () {
          controller.setMoveSummary(req, res, nextSpy)
        })

        it('should call presenter correctly', function () {
          expect(
            presenters.moveToMetaListComponent
          ).to.be.calledOnceWithExactly({
            ...mockSessionModel,
            from_location: {
              title: 'Mock current location',
            },
          })
        })

        it('should set locals as expected', function () {
          expect(res.locals).to.deep.equal({
            existing_key: 'foo',
            person: mockSessionModel.person,
            moveSummary: {},
          })
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
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

        it('should set current location ID', function () {
          expect(req.form.values.from_location).to.be.undefined
        })

        it('should set from location type', function () {
          expect(req.form.values.from_location_type).to.be.undefined
        })

        it('should set can upload documents values', function () {
          expect(req.form.values.can_upload_documents).to.be.undefined
        })

        it('should call parent method', function () {
          expect(
            FormController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, {}, nextSpy)
        })
      })
    })
  })
})
