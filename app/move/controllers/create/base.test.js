const FormController = require('hmpo-form-wizard').Controller

const presenters = require('../../../../common/presenters')

const CreateBaseController = require('./base')

const controller = new CreateBaseController({ route: '/' })

describe('Move controllers', function() {
  describe('Create base controller', function() {
    describe('#middlewareChecks()', function() {
      beforeEach(function() {
        sinon.stub(FormController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')

        controller.middlewareChecks()
      })

      it('should call parent method', function() {
        expect(FormController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call check current location method', function() {
        expect(controller.use).to.have.been.calledWith(
          controller.checkCurrentLocation
        )
      })
    })

    describe('#middlewareLocals()', function() {
      beforeEach(function() {
        sinon.stub(FormController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function() {
        expect(FormController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call set button text method', function() {
        expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
          controller.setButtonText
        )
      })

      it('should call set cancel url method', function() {
        expect(controller.use.getCall(1)).to.have.been.calledWithExactly(
          controller.setCancelUrl
        )
      })

      it('should call set move summary method', function() {
        expect(controller.use.getCall(2)).to.have.been.calledWithExactly(
          controller.setMoveSummary
        )
      })

      it('should call set journey timer method', function() {
        expect(controller.use.getCall(3)).to.have.been.calledWithExactly(
          controller.setJourneyTimer
        )
      })

      it('should call correct number of middleware', function() {
        expect(controller.use).to.be.callCount(4)
      })
    })

    describe('#setButtonText()', function() {
      let req, nextSpy

      beforeEach(function() {
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
        }
        sinon.stub(FormController.prototype, 'getNextStep')
      })

      context('with buttonText option', function() {
        beforeEach(function() {
          req.form.options.buttonText = 'Override button text'
          FormController.prototype.getNextStep.returns('/')

          controller.setButtonText(req, {}, nextSpy)
        })

        it('should set cancel url correctly', function() {
          expect(req.form.options.buttonText).to.equal('Override button text')
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with no buttonText option', function() {
        context('when step is not penultimate step', function() {
          beforeEach(function() {
            FormController.prototype.getNextStep.returns('/step-one')

            controller.setButtonText(req, {}, nextSpy)
          })

          it('should set cancel url correctly', function() {
            expect(req.form.options.buttonText).to.equal('actions::continue')
          })

          it('should call next', function() {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('when step is penultimate step', function() {
          beforeEach(function() {
            FormController.prototype.getNextStep.returns('/last-step')

            controller.setButtonText(req, {}, nextSpy)
          })

          it('should set cancel url correctly', function() {
            expect(req.form.options.buttonText).to.equal(
              'actions::request_move'
            )
          })

          it('should call next', function() {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })
    })

    describe('#setCancelUrl()', function() {
      let res, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        res = {
          locals: {},
        }
      })

      context('with no moves url local', function() {
        beforeEach(function() {
          controller.setCancelUrl({}, res, nextSpy)
        })

        it('should set cancel url correctly', function() {
          expect(res.locals).to.have.property('cancelUrl')
          expect(res.locals.cancelUrl).to.be.undefined
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with moves url local', function() {
        beforeEach(function() {
          res.locals.MOVES_URL = '/moves?move-date=2019-10-10'
          controller.setCancelUrl({}, res, nextSpy)
        })

        it('should set cancel url moves url', function() {
          expect(res.locals).to.have.property('cancelUrl')
          expect(res.locals.cancelUrl).to.equal('/moves?move-date=2019-10-10')
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#checkCurrentLocation()', function() {
      let req, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          session: {},
        }
      })

      context('when current location exists', function() {
        beforeEach(function() {
          req.session = {
            currentLocation: {},
          }
          controller.checkCurrentLocation(req, {}, nextSpy)
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when no current location exists', function() {
        beforeEach(function() {
          controller.checkCurrentLocation(req, {}, nextSpy)
        })

        it('should call next with error', function() {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy.args[0][0]).to.be.an('error')
          expect(nextSpy.args[0][0].message).to.equal(
            'Current location is not set in session'
          )
          expect(nextSpy.args[0][0].code).to.equal('MISSING_LOCATION')
        })
      })
    })

    describe('#getMove()', function() {
      const req = {
        sessionModel: {
          toJSON: sinon.stub(),
        },
      }
      const res = {}
      const mockSessionModel = {
        foo: 'bar',
      }

      beforeEach(function() {
        req.sessionModel.toJSON.returns()
      })

      it('should get session model correctly', function() {
        controller.getMove(req, res)
        expect(req.sessionModel.toJSON).to.be.calledOnceWithExactly()
      })

      context('When session model exists', function() {
        beforeEach(function() {
          req.sessionModel.toJSON.returns(mockSessionModel)
        })
        it('should return session model', function() {
          expect(controller.getMove(req, res)).to.equal(mockSessionModel)
        })
      })

      context('When no session model exists', function() {
        it('should return an empty object', function() {
          expect(controller.getMove(req, res)).to.deep.equal({})
        })
      })
    })

    describe('#getMoveId()', function() {
      const req = {}
      const res = {}

      beforeEach(function() {
        sinon.stub(controller, 'getMove').returns({})
      })

      it('should get move correctly', function() {
        controller.getMoveId(req, res)
        expect(controller.getMove).to.be.calledOnceWithExactly(req, res)
      })

      context('When move exists ', function() {
        beforeEach(function() {
          controller.getMove.returns({ id: '#id' })
        })
        it('should return the id', function() {
          expect(controller.getMoveId(req, res)).to.equal('#id')
        })
      })

      context('When no move exists', function() {
        it('should return undefined', function() {
          expect(controller.getMoveId(req, res)).to.be.undefined
        })
      })
    })

    describe('#getPerson()', function() {
      const req = {
        sessionModel: {
          get: sinon.stub(),
        },
      }
      const res = {}
      const mockPerson = {
        foo: 'bar',
      }

      beforeEach(function() {
        req.sessionModel.get.returns()
      })

      it('should get session model correctly', function() {
        controller.getPerson(req, res)
        expect(req.sessionModel.get).to.be.calledOnceWithExactly('person')
      })

      context('When session model has a person', function() {
        beforeEach(function() {
          req.sessionModel.get.returns(mockPerson)
        })
        it('should return the person', function() {
          expect(controller.getPerson(req, res)).to.equal(mockPerson)
        })
      })

      context('When session model has no person', function() {
        it('should return an empty object', function() {
          expect(controller.getPerson(req, res)).to.deep.equal({})
        })
      })
    })

    describe('#getPersonId()', function() {
      const req = {}
      const res = {}

      beforeEach(function() {
        sinon.stub(controller, 'getPerson').returns({})
      })

      it('should get person correctly', function() {
        controller.getPersonId(req, res)
        expect(controller.getPerson).to.be.calledOnceWithExactly(req, res)
      })

      context('When person exists ', function() {
        beforeEach(function() {
          controller.getPerson.returns({ id: '#id' })
        })
        it('should return the id', function() {
          expect(controller.getPersonId(req, res)).to.equal('#id')
        })
      })

      context('When no person exists', function() {
        it('should return undefined', function() {
          expect(controller.getPersonId(req, res)).to.be.undefined
        })
      })
    })

    describe('#setMoveSummary()', function() {
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
          fullname: 'Benn, Mr',
          last_name: 'Benn',
        },
      }

      beforeEach(function() {
        sinon.stub(presenters, 'moveToMetaListComponent').returnsArg(0)
        sinon.stub(controller, 'getPerson').returns(mockSessionModel.person)
        sinon.stub(controller, 'getMove').returns(mockSessionModel)
        nextSpy = sinon.spy()
        req = {
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

      context('with move_type', function() {
        beforeEach(function() {
          controller.getMove.returns({
            ...mockSessionModel,
            move_type: 'court_appearance',
          })

          controller.setMoveSummary(req, res, nextSpy)
        })

        it('should call presenter correctly', function() {
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

        it('should set locals as expected', function() {
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

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('without move_type', function() {
        beforeEach(function() {
          controller.setMoveSummary(req, res, nextSpy)
        })

        it('should call presenter correctly', function() {
          expect(
            presenters.moveToMetaListComponent
          ).to.be.calledOnceWithExactly({
            ...mockSessionModel,
            from_location: {
              title: 'Mock current location',
            },
          })
        })

        it('should set locals as expected', function() {
          expect(res.locals).to.deep.equal({
            existing_key: 'foo',
            person: mockSessionModel.person,
            moveSummary: {},
          })
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setJourneyTimer()', function() {
      let req, nextSpy

      beforeEach(function() {
        this.clock = sinon.useFakeTimers(new Date('2017-08-10').getTime())
        req = {
          sessionModel: {
            get: sinon.stub(),
            set: sinon.stub(),
          },
        }
        nextSpy = sinon.spy()
      })

      context('with no timestamp in the session', function() {
        beforeEach(function() {
          req.sessionModel.get.withArgs('journeyTimestamp').returns(undefined)
          controller.setJourneyTimer(req, {}, nextSpy)
        })

        it('should set timestamp', function() {
          expect(req.sessionModel.set).to.be.calledOnceWithExactly(
            'journeyTimestamp',
            1502323200000
          )
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with timestamp in the session', function() {
        const mockTimestamp = 11212121212

        beforeEach(function() {
          req.sessionModel.get
            .withArgs('journeyTimestamp')
            .returns(mockTimestamp)
          controller.setJourneyTimer(req, {}, nextSpy)
        })

        it('should not set timestamp', function() {
          expect(req.sessionModel.set).not.to.be.called
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#saveValues()', function() {
      let req, nextSpy
      const currentLocationMock = {
        id: '12345',
        location_type: 'police',
        can_upload_documents: true,
      }

      beforeEach(function() {
        sinon.stub(FormController.prototype, 'saveValues')
        req = {
          form: {
            values: {},
          },
          session: {
            currentLocation: currentLocationMock,
          },
        }
        nextSpy = sinon.spy()
        controller.saveValues(req, {}, nextSpy)
      })

      it('should set current location ID', function() {
        expect(req.form.values.from_location).to.equal(currentLocationMock.id)
      })

      it('should set from location type', function() {
        expect(req.form.values.from_location_type).to.equal(
          currentLocationMock.location_type
        )
      })

      it('should set can upload documents values', function() {
        expect(req.form.values.can_upload_documents).to.equal(
          currentLocationMock.can_upload_documents
        )
      })

      it('should call parent method', function() {
        expect(FormController.prototype.saveValues).to.be.calledOnceWithExactly(
          req,
          {},
          nextSpy
        )
      })
    })
  })
})
