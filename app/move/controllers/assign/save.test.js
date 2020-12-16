const filters = require('../../../../config/nunjucks/filters')
const CreateSave = require('../../app/new/controllers/save')

const MixinProto = CreateSave.prototype
const AssignBaseController = require('./base')
const SaveController = require('./save')

const controller = new SaveController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Assign controllers', function () {
  describe('Assign save controller', function () {
    it('should extend AssignBaseController', function () {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        AssignBaseController.prototype
      )
    })

    describe('When mixing in create controller', function () {
      it('should copy process from CreatePersonSearch', function () {
        expect(controller.process).to.exist.and.equal(MixinProto.process)
      })

      it('should only have the expected methods of its own', function () {
        const ownMethods = ['saveValues', 'errorHandler', 'successHandler']
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop) || ownMethods.includes(prop)
        )
        expect(ownProps).to.deep.equal(ownMethods)
      })
    })

    describe('#saveValues()', function () {
      const profile = {
        id: '__profile__',
        person: {
          id: '__person__',
        },
      }
      const sessionData = {
        'csrf-secret': '__csrf-secret__',
        errors: '__errors__',
        errorValues: '__errorValues__',
        foo: 'bar',
        move: {
          id: '__move__',
        },
        person: {
          id: '__person__',
        },
        assessment: '__assessment__',
      }
      const updatedMove = {
        id: '__updatedMove__',
      }
      const res = {}
      let req
      let next
      let profileService
      let moveService
      beforeEach(function () {
        profileService = {
          create: sinon.stub().resolves(profile),
          update: sinon.stub(),
        }
        moveService = {
          update: sinon.stub().returns(updatedMove),
        }
        req = {
          sessionModel: {
            set: sinon.stub(),
            toJSON: sinon.stub().returns(sessionData),
          },
          services: {
            profile: profileService,
            move: moveService,
          },
        }
        next = sinon.stub()
      })
      describe('When allocating the person to the move', function () {
        beforeEach(async function () {
          await controller.saveValues(req, res, next)
        })

        it('should update the move', function () {
          expect(moveService.update).to.be.calledOnceWithExactly({
            foo: 'bar',
            move: sessionData.move,
            person: sessionData.person,
            assessment: sessionData.assessment,
            id: '__move__',
            profile,
          })
        })

        it('should update the person', function () {
          expect(profileService.create).to.be.calledOnceWithExactly(
            '__person__',
            {
              assessment_answers: sessionData.assessment,
            }
          )
        })

        it('should call set move ID on session model', function () {
          expect(req.sessionModel.set).to.be.calledOnceWithExactly(
            'moveId',
            updatedMove.id
          )
        })

        it('should call next', function () {
          expect(next).to.be.calledOnceWithExactly()
        })
      })

      describe('When an error is thrown', function () {
        const error = new Error()
        beforeEach(async function () {
          profileService.create.throws(error)
          await controller.saveValues(req, res, next)
        })

        it('should call next with error', function () {
          expect(next).to.be.calledOnceWithExactly(error)
        })
      })
    })

    describe('#successHandler()', function () {
      const mockMoveId = '12345'
      let req, res, nextSpy

      beforeEach(async function () {
        req = {
          sessionModel: {
            get: sinon.stub().withArgs('moveId').returns(mockMoveId),
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

        await controller.successHandler(req, res, nextSpy)
      })

      it('should reset the journey', function () {
        expect(req.journeyModel.reset).to.have.been.calledOnce
      })

      it('should reset the session', function () {
        expect(req.sessionModel.reset).to.have.been.calledOnce
      })

      it('should redirect correctly', function () {
        expect(res.redirect).to.have.been.calledOnce
        expect(res.redirect).to.have.been.calledWith(
          `/move/${mockMoveId}/confirmation`
        )
      })

      it('should not call next', function () {
        expect(nextSpy).not.to.have.been.called
      })
    })

    describe('#errorHandler()', function () {
      let err
      let res = {}
      let req = {}
      let next

      beforeEach(function () {
        req = {
          t: sinon.stub().returnsArg(0),
          sessionModel: {
            get: sinon
              .stub()
              .withArgs('person')
              .returns({ _fullname: 'DOE, JOHN' }),
          },
          move: {
            id: '12345',
            date: '2020-10-10',
            allocation: {
              to_location: {
                title: 'BRIXTON',
              },
            },
          },
        }
        res = {
          render: sinon.stub(),
        }
        sinon.stub(filters, 'formatDateWithDay').returnsArg(0)
        sinon.stub(AssignBaseController.prototype, 'errorHandler')
        next = sinon.stub()
      })

      describe('When a move conflict error is thrown', function () {
        beforeEach(function () {
          err = {
            statusCode: 422,
            errors: [
              {
                code: 'taken',
                meta: {
                  existing_id: '__existing_id__',
                },
              },
            ],
          }
          controller.errorHandler(err, req, res, next)
        })
        it('should not invoke super', function () {
          expect(AssignBaseController.prototype.errorHandler).to.not.be.called
        })

        it('should render the conflict page', function () {
          expect(res.render).to.be.calledOnceWithExactly('action-prevented', {
            pageTitle: 'validation::assign_conflict.heading',
            message: 'validation::assign_conflict.message',
            instruction: 'validation::assign_conflict.instructions',
          })
        })

        it('should translate page title', function () {
          expect(req.t).to.have.been.calledWithExactly(
            'validation::assign_conflict.heading'
          )
        })

        it('should translate message', function () {
          expect(req.t).to.have.been.calledWithExactly(
            'validation::assign_conflict.message',
            {
              href: '/move/__existing_id__',
              name: 'DOE, JOHN',
              location: 'BRIXTON',
              date: '2020-10-10',
            }
          )
        })

        it('should translate instruction', function () {
          expect(req.t).to.have.been.calledWithExactly(
            'validation::assign_conflict.instructions',
            {
              assign_href: '/move/12345/assign',
            }
          )
        })
      })

      describe('When a 422 is thrown without the taken code', function () {
        beforeEach(function () {
          err = {
            statusCode: 422,
            errors: [
              {
                code: 'anotherCode',
                meta: {
                  existing_id: '__existing_id__',
                },
              },
            ],
          }
          controller.errorHandler(err, req, res, next)
        })
        it('should invoke super', function () {
          expect(
            AssignBaseController.prototype.errorHandler
          ).to.be.calledOnceWithExactly(err, req, res, next)
        })

        it('should not render the conflict page', function () {
          expect(res.render).to.not.be.called
        })
      })

      describe('When any other kind of error is thrown', function () {
        beforeEach(function () {
          err = {
            statusCode: 400,
            errors: [
              {
                code: 'taken',
                meta: {
                  existing_id: '__existing_id__',
                },
              },
            ],
          }
          controller.errorHandler(err, req, res, next)
        })
        it('should invoke super', function () {
          expect(
            AssignBaseController.prototype.errorHandler
          ).to.be.calledOnceWithExactly(err, req, res, next)
        })

        it('should not render the conflict page', function () {
          expect(res.render).to.not.be.called
        })
      })
    })
  })
})
