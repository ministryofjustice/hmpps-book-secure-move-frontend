const moveService = require('../../../../common/services/move')
const personService = require('../../../../common/services/person')
const CreateSave = require('../create/save')

const MixinProto = CreateSave.prototype
const AssignBaseController = require('./base')
const SaveController = require('./save')

const controller = new SaveController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Assign controllers', function() {
  describe('Assign save controller', function() {
    it('should extend AssignBaseController', function() {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        AssignBaseController.prototype
      )
    })

    describe('When mixing in create controller', function() {
      it('should copy process from CreatePersonSearch', function() {
        expect(controller.process).to.exist.and.equal(MixinProto.process)
      })

      it('should only have the expected methods of its own', function() {
        const ownMethods = ['saveValues', 'errorHandler', 'successHandler']
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop) || ownMethods.includes(prop)
        )
        expect(ownProps).to.deep.equal(ownMethods)
      })
    })

    describe('#saveValues()', function() {
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
      beforeEach(function() {
        req = {
          sessionModel: {
            set: sinon.stub(),
            toJSON: sinon.stub().returns(sessionData),
          },
        }
        next = sinon.stub()
        sinon.stub(moveService, 'update').returns(updatedMove)
        sinon.stub(personService, 'update')
      })
      describe('When allocating the person to the move', function() {
        beforeEach(async function() {
          await controller.saveValues(req, res, next)
        })

        it('should update the move', function() {
          expect(moveService.update).to.be.calledOnceWithExactly({
            move: sessionData.move,
            assessment: sessionData.assessment,
            id: sessionData.move.id,
            person: sessionData.person.id,
            foo: 'bar',
          })
        })

        it('should update the person', function() {
          expect(personService.update).to.be.calledOnceWithExactly({
            id: sessionData.person.id,
            assessment_answers: sessionData.assessment,
          })
        })

        it('should call set move on session model', function() {
          expect(req.sessionModel.set).to.be.calledOnceWithExactly(
            'move',
            updatedMove
          )
        })

        it('should call next', function() {
          expect(next).to.be.calledOnceWithExactly()
        })
      })

      describe('When an error is thrown', function() {
        const error = new Error()
        beforeEach(async function() {
          personService.update.throws(error)
          await controller.saveValues(req, res, next)
        })

        it('should call next with error', function() {
          expect(next).to.be.calledOnceWithExactly(error)
        })
      })
    })
  })

  describe('#errorHandler()', function() {
    let err
    let res = {}
    const req = {}
    let next
    beforeEach(function() {
      res = {
        render: sinon.stub(),
      }
      sinon.stub(AssignBaseController.prototype, 'errorHandler')
      next = sinon.stub()
    })
    describe('When a move conflict error is thrown', function() {
      beforeEach(function() {
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
      it('should not invoke super', function() {
        expect(AssignBaseController.prototype.errorHandler).to.not.be.called
      })

      it('should render the conflict page', function() {
        expect(res.render).to.be.calledOnceWithExactly(
          'move/views/assign/assign-conflict',
          {
            existingMoveId: '__existing_id__',
          }
        )
      })
    })

    describe('When a 422 is thrown without the taken code', function() {
      beforeEach(function() {
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
      it('should invoke super', function() {
        expect(
          AssignBaseController.prototype.errorHandler
        ).to.be.calledOnceWithExactly(err, req, res, next)
      })

      it('should not render the conflict page', function() {
        expect(res.render).to.not.be.called
      })
    })

    describe('When any other kind of error is thrown', function() {
      beforeEach(function() {
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
      it('should invoke super', function() {
        expect(
          AssignBaseController.prototype.errorHandler
        ).to.be.calledOnceWithExactly(err, req, res, next)
      })

      it('should not render the conflict page', function() {
        expect(res.render).to.not.be.called
      })
    })
  })

  describe('#successHandler()', function() {
    const res = {}
    const req = {}
    let next
    beforeEach(function() {
      sinon.stub(AssignBaseController.prototype, 'successHandler')
      next = sinon.stub()
      controller.successHandler(req, res, next)
    })

    it('should invoke super', function() {
      expect(
        AssignBaseController.prototype.successHandler
      ).to.be.calledOnceWithExactly(req, res, next)
    })

    it('should not call next', function() {
      expect(next).to.not.be.called
    })
  })
})
